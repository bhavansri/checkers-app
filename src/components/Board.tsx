import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardSquare, { DropItemProps } from "./BoardSquare";
import { CpuPiece, PlayerPiece } from "./CheckerPiece";

type BoardProps = {
  player: { [id: string]: number[] };
  updatePosition: (position: number[], item: DropItemProps) => void;
  computer: { [id: string]: number[] };
};

function renderSquare(
  i: number,
  player: { [id: string]: number[] },
  computer: { [id: string]: number[] },
  updatePosition: (position: number[], item: DropItemProps) => void
) {
  const x = i % 8;
  const y = Math.floor(i / 8);

  function showChecker(dict: { [id: string]: number[] }): boolean {
    for (const key in dict) {
      const val: number[] = dict[key];

      if (val[0] === x && val[1] === y) {
        return true;
      }
    }

    return false;
  }

  function getIdForPiece(dict: { [id: string]: number[] }): string {
    for (const key in dict) {
      const val: number[] = dict[key];

      if (val[0] === x && val[1] === y) {
        return key;
      }
    }

    return "";
  }

  function canMoveChecker(final: number[], item: DropItemProps): boolean {
    const initial: number[] = player[item.id];

    for (const key in player) {
      if (player[key][0] === final[0] && player[key][1] === final[1]) {
        return false;
      }
    }

    if (
      (initial[0] + 1 == final[0] && initial[1] - 1 == final[1]) ||
      (initial[0] - 1 == final[0] && initial[1] - 1 == final[1])
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
        <>
          {showChecker(player) ? (
            <PlayerPiece id={getIdForPiece(player)} />
          ) : null}
          {showChecker(computer) ? (
            <CpuPiece id={getIdForPiece(computer)} />
          ) : null}
        </>
      </BoardSquare>
    </div>
  );
}

const Board = ({ player, updatePosition, computer }: BoardProps) => {
  const squares = [];

  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i, player, computer, updatePosition));
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full w-full flex flex-wrap">{squares}</div>
    </DndProvider>
  );
};

export default Board;
