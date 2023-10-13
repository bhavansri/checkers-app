import { useDrop } from "react-dnd";
import Square from "./Square";
import { ItemTypes } from "../utils/constants";

type BoardSquareProps = {
  x: number;
  y: number;
  moveChecker: (final: number[], id: string) => void;
  canMoveChecker: (final: number[], id: string) => boolean;
  hoveringId: string | null;
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
  hoveringId,
  children,
}: BoardSquareProps) => {
  const dark = (x + y) % 2 === 1;
  const showHoverPreview =
    hoveringId !== null ? canMoveChecker([x, y], hoveringId) : false;
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CHECKER,
      canDrop: (item: DropItemProps) => canMoveChecker([x, y], item.id),
      drop: (item: DropItemProps) => moveChecker([x, y], item.id),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [x, y, moveChecker, canMoveChecker]
  );

  showHoverPreview && console.log(showHoverPreview, x, y);

  return (
    <div ref={drop} className="relative w-full h-full">
      <Square dark={dark}>{children}</Square>
      {(showHoverPreview || (!isOver && canDrop)) && (
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
