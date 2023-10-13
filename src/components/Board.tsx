import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardSquare from "./BoardSquare";
import { CpuPiece, PlayerPiece } from "./CheckerPiece";
import { CpuType, PlayerType } from "../utils/constants";

type BoardProps = {
  player: PlayerType;
  moveChecker: (final: number[], id: string) => void;
  canMoveChecker: (final: number[], id: string) => boolean;
  onHoverChange: (isHovering: boolean, itemId: string) => void;
  hoverElement: string | null;
  computer: CpuType;
};

function renderSquare(
  i: number,
  player: PlayerType,
  computer: CpuType,
  moveChecker: (final: number[], id: string) => void,
  canMoveChecker: (final: number[], id: string) => boolean,
  hoveringId: string | null,
  onHoverChange: (isHovering: boolean, itemId: string) => void
) {
  const x = i % 8;
  const y = Math.floor(i / 8);

  function showChecker(dict: CpuType): boolean {
    for (const key in dict) {
      const val: number[] = dict[key].coords;

      if (val[0] === x && val[1] === y) {
        return true;
      }
    }

    return false;
  }

  function showCpuChecker(dict: CpuType): boolean {
    for (const key in dict) {
      const val: number[] = dict[key].coords;

      if (val[0] === x && val[1] === y) {
        return true;
      }
    }

    return false;
  }

  function getIdForPiece(dict: PlayerType): string {
    for (const key in dict) {
      const val: number[] = dict[key].coords;

      if (val[0] === x && val[1] === y) {
        return key;
      }
    }

    return "";
  }

  function getCpuIdForPiece(dict: CpuType): string {
    for (const key in dict) {
      const val: number[] = dict[key].coords;

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
        hoveringId={hoveringId}
      >
        <>
          {showChecker(player) ? (
            <PlayerPiece
              id={getIdForPiece(player)}
              onHoverChange={onHoverChange}
            />
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
  onHoverChange,
  hoverElement,
}: BoardProps) => {
  const squares = [];

  for (let i = 0; i < 64; i++) {
    squares.push(
      renderSquare(
        i,
        player,
        computer,
        moveChecker,
        canMoveChecker,
        hoverElement,
        onHoverChange
      )
    );
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full w-full flex flex-wrap">{squares}</div>
    </DndProvider>
  );
};

export default Board;
