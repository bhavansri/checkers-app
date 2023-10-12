import { useDrop } from "react-dnd";
import Square from "./Square";
import { ItemTypes } from "../utils/Constants";

type BoardSquareProps = {
  x: number;
  y: number;
  moveChecker: (coords: number[]) => void;
  canMoveChecker: (coords: number[]) => boolean;
  children: JSX.Element | null;
};

const BoardSquare = ({
  x,
  y,
  moveChecker,
  canMoveChecker,
  children,
}: BoardSquareProps) => {
  const dark = (x + y) % 2 === 1;
  const [{ isOver, canDrop, item }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CHECKER,
      canDrop: () => canMoveChecker([x, y]),
      drop: () => moveChecker([x, y]),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
        item: monitor.getItem(),
      }),
    }),
    [x, y, moveChecker, canMoveChecker]
  );

  console.log("Dragged item: " + item);
  return (
    <div ref={drop} className="relative w-full h-full">
      <Square dark={dark}>{children}</Square>
      {!isOver && canDrop && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "yellow",
          }}
        />
      )}
      {isOver && canDrop && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "green",
          }}
        />
      )}
    </div>
  );
};

export default BoardSquare;
