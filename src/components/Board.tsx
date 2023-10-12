import { DndProvider } from "react-dnd";
import CheckerPiece from "./CheckerPiece";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardSquare from "./BoardSquare";

type BoardProps = {
  playerPositions: number[];
  updatePosition: (position: number[]) => void;
};

function renderSquare(
  i: number,
  checkerPosition: number[],
  updatePosition: (position: number[]) => void
) {
  const x = i % 8;
  const y = Math.floor(i / 8);
  const displayChecker = checkerPosition[0] === x && checkerPosition[1] === y;

  function canMoveChecker(destPos: number[]): boolean {
    if (
      (checkerPosition[0] + 1 == destPos[0] &&
        checkerPosition[1] + 1 == destPos[1]) ||
      (checkerPosition[0] - 1 == destPos[0] &&
        checkerPosition[1] + 1 == destPos[1])
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
        {displayChecker ? <CheckerPiece dark={true} /> : null}
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
