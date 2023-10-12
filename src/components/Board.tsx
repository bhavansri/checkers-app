import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardSquare from "./BoardSquare";
import { CpuPiece, PlayerPiece } from "./CheckerPiece";
import { PlayerCheckerProps } from "../App";

type BoardProps = {
  player: { [id: string]: PlayerCheckerProps };
  moveChecker: (final: number[], id: string) => void;
  canMoveChecker: (final: number[], id: string) => boolean;
  computer: { [id: string]: number[] };
};

function renderSquare(
  i: number,
  player: { [id: string]: PlayerCheckerProps },
  computer: { [id: string]: number[] },
  moveChecker: (final: number[], id: string) => void,
  canMoveChecker: (final: number[], id: string) => boolean
) {
  const x = i % 8;
  const y = Math.floor(i / 8);

  function showChecker(dict: { [id: string]: PlayerCheckerProps }): boolean {
    for (const key in dict) {
      const val: number[] = dict[key].coords;

      if (val[0] === x && val[1] === y) {
        return true;
      }
    }

    return false;
  }

  function showCpuChecker(dict: { [id: string]: number[] }): boolean {
    for (const key in dict) {
      const val: number[] = dict[key];

      if (val[0] === x && val[1] === y) {
        return true;
      }
    }

    return false;
  }

  function getIdForPiece(dict: { [id: string]: PlayerCheckerProps }): string {
    for (const key in dict) {
      const val: number[] = dict[key].coords;

      if (val[0] === x && val[1] === y) {
        return key;
      }
    }

    return "";
  }

  function getCpuIdForPiece(dict: { [id: string]: number[] }): string {
    for (const key in dict) {
      const val: number[] = dict[key];

      if (val[0] === x && val[1] === y) {
        return key;
      }
    }

    return "";
  }

  return (
    <div key={i} style={{ width: "12.5%", height: "12.5%" }}>
      <BoardSquare
        x={x}
        y={y}
        moveChecker={moveChecker}
        canMoveChecker={canMoveChecker}
      >
        <>
          {showChecker(player) ? (
            <PlayerPiece id={getIdForPiece(player)} />
          ) : null}
          {showCpuChecker(computer) ? (
            <CpuPiece id={getCpuIdForPiece(computer)} />
          ) : null}
        </>
      </BoardSquare>
    </div>
  );
}

const Board = ({
  player,
  computer,
  moveChecker,
  canMoveChecker,
}: BoardProps) => {
  const squares = [];

  for (let i = 0; i < 64; i++) {
    squares.push(
      renderSquare(i, player, computer, moveChecker, canMoveChecker)
    );
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full w-full flex flex-wrap">{squares}</div>
    </DndProvider>
  );
};

export default Board;
