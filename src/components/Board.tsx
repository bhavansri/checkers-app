import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardSquare from "./BoardSquare";
import { CpuPiece, PlayerPiece } from "./CheckerPiece";
import { CpuCheckerProps, PlayerCheckerProps } from "../utils/Constants";

type BoardProps = {
  player: { [id: string]: PlayerCheckerProps };
  moveChecker: (final: number[], id: string) => void;
  canMoveChecker: (final: number[], id: string) => boolean;
  onHoverChange: (isHovering: boolean, itemId: string) => void;
  hoverElement: string | null;
  computer: { [id: string]: CpuCheckerProps };
};

function renderSquare(
  i: number,
  player: { [id: string]: PlayerCheckerProps },
  computer: { [id: string]: CpuCheckerProps },
  moveChecker: (final: number[], id: string) => void,
  canMoveChecker: (final: number[], id: string) => boolean,
  hoveringId: string | null,
  onHoverChange: (isHovering: boolean, itemId: string) => void
) {
  const x = i % 8;
  const y = Math.floor(i / 8);

  hoveringId && console.log("hovering: " + hoveringId);
  function showChecker(dict: { [id: string]: PlayerCheckerProps }): boolean {
    for (const key in dict) {
      const val: number[] = dict[key].coords;

      if (val[0] === x && val[1] === y) {
        return true;
      }
    }

    return false;
  }

  function showCpuChecker(dict: { [id: string]: CpuCheckerProps }): boolean {
    for (const key in dict) {
      const val: number[] = dict[key].coords;

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

  function getCpuIdForPiece(dict: { [id: string]: CpuCheckerProps }): string {
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
