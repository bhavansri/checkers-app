import BoardSquare from "./BoardSquare";
import { CpuPiece, PlayerPiece } from "./CheckerPiece";
import { ComputerPieces, GameState, PlayerPieces } from "../utils/constants";

type BoardProps = {
  game: GameState;
  moveChecker: (final: number[], id: string) => void;
  canMoveChecker: (final: number[], id: string) => boolean;
  onHoverChange: (isHovering: boolean, itemId: string) => void;
  hoverElement: string | null;
};

function renderSquare(
  i: number,
  game: GameState,
  moveChecker: (final: number[], id: string) => void,
  canMoveChecker: (final: number[], id: string) => boolean,
  hoveringId: string | null,
  onHoverChange: (isHovering: boolean, itemId: string) => void
) {
  const x = i % 8;
  const y = Math.floor(i / 8);

  function showChecker(dict: ComputerPieces): boolean {
    for (const key in dict) {
      const val: number[] = dict[key].coords;

      if (val[0] === x && val[1] === y) {
        return true;
      }
    }

    return false;
  }

  function showCpuChecker(dict: ComputerPieces): boolean {
    for (const key in dict) {
      const val: number[] = dict[key].coords;

      if (val[0] === x && val[1] === y) {
        return true;
      }
    }

    return false;
  }

  function getIdForPiece(dict: PlayerPieces): string {
    for (const key in dict) {
      const val: number[] = dict[key].coords;

      if (val[0] === x && val[1] === y) {
        return key;
      }
    }

    return "";
  }

  function getCpuIdForPiece(dict: ComputerPieces): string {
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
          {showChecker(game.playerCheckers) ? (
            <PlayerPiece
              id={getIdForPiece(game.playerCheckers)}
              onHoverChange={onHoverChange}
            />
          ) : null}
          {showCpuChecker(game.computerCheckers) ? (
            <CpuPiece id={getCpuIdForPiece(game.computerCheckers)} />
          ) : null}
        </>
      </BoardSquare>
    </div>
  );
}

const Board = ({
  game,
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
        game,
        moveChecker,
        canMoveChecker,
        hoverElement,
        onHoverChange
      )
    );
  }
  return <div className="h-full w-full flex flex-wrap">{squares}</div>;
};

export default Board;
