import React from "react";
import rectangleIcon from '../resources/rectangle.svg';
import lineIcon from '../resources/line.svg';
import rubberIcon from '../resources/rubber.svg';
import pencilIcon from '../resources/pencil.svg';
import textIcon from '../resources/text.svg';
import selectionIcon from '../resources/selection.svg';
import { toolTypes } from '../constants';
import { useDispatch, useSelector } from "react-redux";
import { setToolType, setElements } from "./whiteboardSlice";
import { emitClearWhiteboard } from "../socketConn/socketConn";

const IconButton = ({ src, type, isRubber }) => {
  const dispatch = useDispatch();
  const selectedToolType = useSelector((state) => state.whiteboard.tool);

  const handleToolChange = () => {
    dispatch(setToolType(type));
  };

  const handleClearCanvas = () => {
    dispatch(setElements([]));

    emitClearWhiteboard();
  };

  return (
    <button
      onClick={isRubber ? handleClearCanvas : handleToolChange}
      className={
        selectedToolType === type ? "menu_button_active" : "menu_button"
      }
    >
      <img src={src} className="menu_icon" alt={type} />
    </button>
  );
};

const Menu = () => {
  return (
    <div className="menu-container">
      <IconButton src={rectangleIcon} type={toolTypes.RECTANGLE} />
      <IconButton src={lineIcon} type={toolTypes.LINE} />
      <IconButton src={rubberIcon} type={toolTypes.RUBBER} isRubber={true} />
      <IconButton src={pencilIcon} type={toolTypes.PENCIL} />
      <IconButton src={textIcon} type={toolTypes.TEXT} />
      <IconButton src={selectionIcon} type={toolTypes.SELECTION} />
    </div>
  );
};

export default Menu;