import { useDrop } from "react-dnd";
import Square from "./Square";
import { ItemTypes } from "../utils/Constants";

type BoardSquareProps = {
  x: number;
  y: number;
  moveChecker: (coords: number[], item: DropItemProps) => void;
  canMoveChecker: (coords: number[], item: DropItemProps) => boolean;
  children: JSX.Element | null;
};

export type DropItemProps = {
  id: string;
};

const BoardSquare = ({
  x,
  y,
  moveChecker,
  canMoveChecker,
  children,
}: BoardSquareProps) => {
  const dark = (x + y) % 2 === 1;
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CHECKER,
      canDrop: (item: DropItemProps) => canMoveChecker([x, y], item),
      drop: (item: DropItemProps) => moveChecker([x, y], item),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [x, y, moveChecker, canMoveChecker]
  );

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
