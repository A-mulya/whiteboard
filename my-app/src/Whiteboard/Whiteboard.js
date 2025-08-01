import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import rough from 'roughjs/bundled/rough.esm';
import { useParams } from 'react-router-dom';

import Menu from './Menu';
import { actions, toolTypes, cursorPositions } from '../constants';
import {
  createElement as createCustomElement,
  updateElement,
  drawElement,
  adjustmentRequired,
  adjustmentElementCoordinates,
  getElementAtPosition,
  getCursorForPosition,
  getResizedCoordinates,
  updatePencilElementWhenMoving,
} from './utils';

import {
  setElements,
  updateElement as updateElementInStore,
} from './whiteboardSlice';

import {
  emitCursorPosition,
  emitElementUpdate,
  connectWithSocketServer,
} from '../socketConn/socketConn';

let emitCursor = true;
let lastCursorPosition;

const WhiteBoard = () => {
  const { roomId } = useParams(); // roomId is now required
  const canvasRef = useRef();
  const textareaRef = useRef();
  const dispatch = useDispatch();

  const toolType = useSelector((state) => state.whiteboard.tool);
  const elements = useSelector((state) => state.whiteboard.elements);

  const [action, setAction] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  // ✅ Connect to socket server using private roomId
  useEffect(() => {
    if (roomId) connectWithSocketServer(roomId);
  }, [roomId]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      drawElement({ roughCanvas, context: ctx, element });
    });
  }, [elements]);

  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;

    if (toolType === toolTypes.SELECTION) {
      const element = getElementAtPosition(clientX, clientY, elements);

      if (element) {
        if (
          element.type === toolTypes.RECTANGLE ||
          element.type === toolTypes.TEXT ||
          element.type === toolTypes.LINE
        ) {
          if (element.position === cursorPositions.INSIDE) {
            const offsetX = clientX - element.x1;
            const offsetY = clientY - element.y1;
            setSelectedElement({ ...element, offsetX, offsetY });
            setAction(actions.MOVING);
          } else {
            setSelectedElement({ ...element });
            setAction(actions.RESIZING);
          }
        }

        if (element.type === toolTypes.PENCIL) {
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
          setAction(actions.MOVING);
        }
      } else {
        setSelectedElement(null);
      }

      return;
    }

    let element = null;

    if (
      toolType === toolTypes.RECTANGLE ||
      toolType === toolTypes.LINE ||
      toolType === toolTypes.PENCIL ||
      toolType === toolTypes.TEXT
    ) {
      element = createCustomElement({
        x1: clientX,
        y1: clientY,
        x2: clientX,
        y2: clientY,
        toolType,
        id: uuid(),
      });

      if (!element) return;

      setSelectedElement(element);
      dispatch(updateElementInStore(element));

      if (
        toolType === toolTypes.RECTANGLE ||
        toolType === toolTypes.LINE ||
        toolType === toolTypes.PENCIL
      ) {
        setAction(actions.DRAWING);
      } else if (toolType === toolTypes.TEXT) {
        setAction(actions.WRITING);
      }
    }
  };

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;

    lastCursorPosition = { x: clientX, y: clientY };

    if (emitCursor) {
      emitCursorPosition({ x: clientX, y: clientY });
      emitCursor = false;
      setTimeout(() => {
        emitCursor = true;
        if (lastCursorPosition) {
          emitCursorPosition(lastCursorPosition);
        }
      }, 50);
    }

    if (toolType === toolTypes.SELECTION) {
      const found = getElementAtPosition(clientX, clientY, elements);
      const cursor = found?.position
        ? getCursorForPosition(found.position)
        : 'default';
      event.target.style.cursor = cursor;

      if (
        action === actions.MOVING &&
        selectedElement?.type === toolTypes.PENCIL
      ) {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: clientX - selectedElement.xOffsets[index],
          y: clientY - selectedElement.yOffsets[index],
        }));

        const index = elements.findIndex(
          (el) => el.id === selectedElement.id
        );
        if (index !== -1) {
          updatePencilElementWhenMoving({ index, newPoints }, elements);
        }
        return;
      }

      if (action === actions.MOVING && selectedElement) {
        const { id, type } = selectedElement;

        const index = elements.findIndex((el) => el.id === id);
        if (index === -1) return;

        const { x1, y1, x2, y2, offsetX, offsetY, text } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;

        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;

        updateElement(
          {
            id,
            x1: newX1,
            y1: newY1,
            x2: newX1 + width,
            y2: newY1 + height,
            type,
            index,
            text: text || '',
          },
          elements
        );

        setSelectedElement({
          ...selectedElement,
          x1: newX1,
          y1: newY1,
          x2: newX1 + width,
          y2: newY1 + height,
        });
      }

      if (action === actions.RESIZING && selectedElement) {
        const { id, type, position, ...coordinates } = selectedElement;

        const { x1, y1, x2, y2 } =
          getResizedCoordinates(clientX, clientY, position, coordinates) || {};

        if (x1 === undefined) return;

        const index = elements.findIndex((el) => el.id === id);
        if (index !== -1) {
          updateElement({ id, x1, y1, x2, y2, type, index }, elements);
          setSelectedElement({ ...selectedElement, x1, y1, x2, y2 });
        }
      }

      return;
    }

    if (action !== actions.DRAWING) return;

    const index = elements.findIndex((el) => el.id === selectedElement?.id);
    if (index !== -1) {
      updateElement(
        {
          index,
          id: elements[index].id,
          x1: elements[index].x1,
          y1: elements[index].y1,
          x2: clientX,
          y2: clientY,
          type: elements[index].type,
        },
        elements
      );
    }
  };

  const handleMouseUp = () => {
    const index = elements.findIndex(
      (el) => el.id === selectedElement?.id
    );

    if (
      index !== -1 &&
      (action === actions.DRAWING || action === actions.RESIZING)
    ) {
      const element = elements[index];

      if (adjustmentRequired(element.type)) {
        const { x1, y1, x2, y2 } = adjustmentElementCoordinates(element);
        updateElement(
          {
            index,
            id: element.id,
            x1,
            y1,
            x2,
            y2,
            type: element.type,
          },
          elements
        );
      }

      emitElementUpdate(elements[index]);
    }

    setAction(null);
    setSelectedElement(null);
  };

  const handleTextareaBlur = (event) => {
    if (!selectedElement) return;

    const { id, x1, y1, type } = selectedElement;
    const index = elements.findIndex((el) => el.id === id);

    if (index !== -1) {
      updateElement(
        {
          index,
          id,
          x1,
          y1,
          type,
          text: event.target.value || '',
        },
        elements
      );
      emitElementUpdate(elements[index]);
    }

    setAction(null);
    setSelectedElement(null);
  };

  return (
    <>
      <Menu />

      {action === actions.WRITING && (
        <textarea
          ref={textareaRef}
          onBlur={handleTextareaBlur}
          style={{
            position: 'absolute',
            top: selectedElement?.y1 - 3,
            left: selectedElement?.x1,
            font: '24px sans-serif',
            margin: '0',
            padding: '0',
            border: '0',
            outline: '0',
            resize: 'auto',
            overflow: 'hidden',
            whiteSpace: 'pre',
            background: 'transparent',
          }}
        />
      )}

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        id="canvas"
      />
    </>
  );
};

export default WhiteBoard;
