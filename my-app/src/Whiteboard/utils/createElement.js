import rough from 'roughjs/bundled/rough.esm';
import { toolTypes } from '../../constants';

const generator = rough.generator();

const generateRectangle = ({ x1, y1, x2, y2 }) =>
  generator.rectangle(x1, y1, x2 - x1, y2 - y1);

const generateLine = (x1, y1, x2, y2) =>
  generator.line(x1, y1, x2, y2);

export const createElement = ({ x1, y1, x2, y2, toolType, id, text }) => {
  if (!toolType) {
    console.warn("toolType is null. Skipping element creation.");
    return null;
  }

  let roughElement;

  switch (toolType) {
    case toolTypes.RECTANGLE:
      roughElement = generateRectangle({ x1, y1, x2, y2 });
      return { id, roughElement, type: toolType, x1, y1, x2, y2 };

    case toolTypes.LINE:
      roughElement = generateLine(x1, y1, x2, y2);
      return { id, roughElement, type: toolType, x1, y1, x2, y2 };

    case toolTypes.PENCIL:
      return { id, type: toolType, points: [{ x: x1, y: y1 }] };

    case toolTypes.TEXT:
      return { id, type: toolType, x1, y1, x2, y2, text: text || '' };

    case toolTypes.SELECTION:
      return null;

    default:
      console.warn("Unrecognized toolType:", toolType);
      return null;
  }
};
