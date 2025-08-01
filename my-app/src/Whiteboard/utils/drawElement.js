import { toolTypes } from "../../constants";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "./getSvgPathFromStore";

// Handles pencil drawing
export const drawPencilElement = (context, element) => {
  const myStroke = getStroke(element.points, { size: 10 });
  const pathData = getSvgPathFromStroke(myStroke);
  const myPath = new Path2D(pathData);
  context.fill(myPath);
};

// Handles text drawing
const drawTextElement = (context, element) => {
  context.textBaseline = "top";
  context.font = "24px sans-serif";
  context.fillText(
    element.text || "",
    element.x1,
    element.y1
  );
};

// Main function to draw elements based on their type
export const drawElement = ({ roughCanvas, context, element }) => {
  if (!element?.type) {
    console.error("⚠️ Skipping element with missing 'type':", element);
    return;
  }

  switch (element.type) {
    case toolTypes.RECTANGLE:
    case toolTypes.LINE:
      if (!element.roughElement) {
        console.warn("⚠️ Missing roughElement for:", element);
        return;
      }
      return roughCanvas.draw(element.roughElement);

    case toolTypes.PENCIL:
      if (!element.points || !Array.isArray(element.points)) {
        console.warn("⚠️ Invalid pencil points for:", element);
        return;
      }
      drawPencilElement(context, element);
      break;

    case toolTypes.TEXT:
      drawTextElement(context, element);
      break;

    default:
      console.error("❌ Unknown element type:", element);
      break;
  }
};
