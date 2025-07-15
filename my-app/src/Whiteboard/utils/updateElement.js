import { createElement } from './createElement';
import { toolTypes } from '../../constants';
import { store } from '../../store/store';
import { setElements } from '../whiteboardSlice';
import { emitElementUpdate } from '../../socketConn/socketConn';

export const updatePencilElementWhenMoving = ({ index, newPoints }, elements) => {
  const elementsCopy = [...elements];

  elementsCopy[index] = {
    ...elementsCopy[index], 
    points: newPoints,
  };
  const updatedPencilElement = elementsCopy[index];
  store.dispatch(setElements(elementsCopy));
  emitElementUpdate(updatedPencilElement);
};



export const updateElement = (
  { id, x1, x2, y1, y2, type, index, text },
  elements
) => {
  const elementsCopy = [...elements];

  switch (type) {
    case toolTypes.LINE:
    case toolTypes.RECTANGLE: {
      const updatedElement = createElement({
        id,
        x1,
        y1,
        x2,
        y2,
        toolType: type,
      });
      elementsCopy[index] = updatedElement;
      store.dispatch(setElements(elementsCopy));
      emitElementUpdate(updatedElement);
      break;
    }

    case toolTypes.PENCIL: {
      elementsCopy[index] = {
        ...elementsCopy[index],
        points: [
          ...elementsCopy[index].points,
          { x: x2, y: y2 }
        ]
      };
      const updatedPencilElement = elementsCopy[index];
      store.dispatch(setElements(elementsCopy));
      emitElementUpdate(updatedPencilElement);
      break;
    }

    case toolTypes.TEXT: {
      const canvas = document.getElementById('canvas');
      if (!canvas) {
        throw new Error('Canvas element not found');
      }

      const ctx = canvas.getContext('2d');
      ctx.font = '24px sans-serif';
      const textWidth = ctx.measureText(text).width;
      const textHeight = 24;

      elementsCopy[index] = {
        id,
        type,
        x1,
        y1,
        x2: x1 + textWidth,
        y2: y1 + textHeight,
        text,
      };

      const updatedTextElement = elementsCopy[index];
      store.dispatch(setElements(elementsCopy));
      emitElementUpdate(updatedTextElement);
      break;
    }

    default:
      throw new Error(`Unknown toolType: ${type}`);
  }
};
