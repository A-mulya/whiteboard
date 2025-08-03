import rough from 'roughjs/bundled/rough.esm';
import { toolTypes } from '../../constants';

const generator = rough.generator();

const generateRectangle = ({ x1, y1, x2, y2 }) => {
  return generator.rectangle(x1, y1, x2 - x1, y2 - y1);
};

const generateLine = (x1, y1, x2, y2) => {
  return generator.line(x1, y1, x2, y2);
};

export const createElement = ({ x1, y1, x2, y2, toolType, id, text }) => {
  let roughElement;

  switch (toolType) {
    case toolTypes.RECTANGLE:
      roughElement = generateRectangle({ x1, y1, x2, y2 });
      return {
        id,
        roughElement,
        type: toolType,
        x1,
        y1,
        x2,
        y2,
      };

    case toolTypes.LINE:
      roughElement = generateLine(x1, y1, x2, y2);
      return {
        id,
        roughElement,
        type: toolType,
        x1,
        y1,
        x2,
        y2,
      };

    case toolTypes.PENCIL:
      return {
        id,
        type: toolType,
        points: [{ x: x1, y: y1 }],
      };

    case toolTypes.TEXT:
      return {
        id,
        type: toolType,
        x1,
        y1,
        x2,
        y2,
        text: text || '',
      };

    case toolTypes.SELECTION: // 🔷 Added this case to handle 'selection'
      console.info("Selection tool does not create a new element."); // 🔷 Optional log
      return null; // 🔷 Nothing is created for selection

    default:
      console.warn("Unrecognized toolType passed to createElement:", toolType);
      throw new Error("Unhandled toolType in createElement: " + toolType);
  }
};