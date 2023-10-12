import { DndProvider } from "react-dnd";
import CheckerPiece from "./CheckerPiece";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardSquare, { DropItemProps } from "./BoardSquare";

type BoardProps = {
  playerPositions: { [id: string]: number[] };
  updatePosition: (position: number[], item: DropItemProps) => void;
};

function renderSquare(
  i: number,
  playerPositions: { [id: string]: number[] },
  updatePosition: (position: number[], item: DropItemProps) => void
) {
  const x = i % 8;
  const y = Math.floor(i / 8);

  function shouldDisplayChecker(): boolean {
    for (const key in playerPositions) {
      const val: number[] = playerPositions[key];

      if (val[0] === x && val[1] === y) {
        return true;
      }
    }

    return false;
  }

  function getId(): string {
    for (const key in playerPositions) {
      const val: number[] = playerPositions[key];

      if (val[0] === x && val[1] === y) {
        return key;
      }
    }

    return "";
  }

  function canMoveChecker(coords: number[], item: DropItemProps): boolean {
    const checkerPosition: number[] = playerPositions[item.id];

    if (
      (checkerPosition[0] + 1 == coords[0] &&
        checkerPosition[1] - 1 == coords[1]) ||
      (checkerPosition[0] - 1 == coords[0] &&
        checkerPosition[1] - 1 == coords[1])
    ) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div key={i} style={{ width: "12.5%", height: "12.5%" }}>
      <BoardSquare
        x={x}
        y={y}
        moveChecker={updatePosition}
        canMoveChecker={canMoveChecker}
      >
        {shouldDisplayChecker() ? (
          <CheckerPiece dark={true} id={getId()} />
        ) : null}
      </BoardSquare>
    </div>
  );
}

const Board = ({ playerPositions, updatePosition }: BoardProps) => {
  const squares = [];

  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i, playerPositions, updatePosition));
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full w-full flex flex-wrap">{squares}</div>
    </DndProvider>
  );
};

export default Board;
