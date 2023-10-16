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

  return (
    <div
      ref={drop}
      className="relative w-full h-full"
      role="Square"
      data-testid={`(${x},${y})`}
    >
      <Square dark={dark}>{children}</Square>
      {(showHoverPreview || (!isOver && canDrop)) && (
        <div className="absolute top-0 left-0 h-full w-full z-[1] opacity-50 bg-yellow-300" />
      )}
      {isOver && canDrop && (
        <div className="absolute top-0 left-0 h-full w-full z-[1] opacity-50 bg-green-500" />
      )}
    </div>
  );
};

export default BoardSquare;
