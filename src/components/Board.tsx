import BoardSquare from "./BoardSquare";
import { CpuPiece, PlayerPiece } from "./CheckerPiece";
import { ComputerPieces, GameState, PlayerPieces } from "../utils/constants";
import { useState } from "react";

type BoardProps = {
  gameState: GameState;
  moveChecker: (final: number[], id: string) => void;
  handleCanMove: (final: number[], id: string) => boolean;
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

  return (
    <div key={i} className="w-[12.5%] h-[12.5%]">
      <BoardSquare
        x={x}
        y={y}
        moveChecker={moveChecker}
        canMoveChecker={canMoveChecker}
        hoveringId={hoveringId}
      >
        <>
          {showChecker(game.present.playerCheckers) ? (
            <PlayerPiece
              id={getIdForPiece(game.present.playerCheckers)}
              onHoverChange={onHoverChange}
            />
          ) : null}
          {showCpuChecker(game.present.computerCheckers) ? <CpuPiece /> : null}
        </>
      </BoardSquare>
    </div>
  );
}

const Board = ({ gameState, moveChecker, handleCanMove }: BoardProps) => {
  const squares = [];
  const [hoverElement, setHoverElement] = useState<string | null>(null);

  const onHoverChange = (isHovering: boolean, itemId: string) => {
    isHovering ? setHoverElement(itemId) : setHoverElement(null);
  };

  for (let i = 0; i < 64; i++) {
    squares.push(
      renderSquare(
        i,
        gameState,
        moveChecker,
        handleCanMove,
        hoverElement,
        onHoverChange
      )
    );
  }

  return <div className="h-full w-full flex flex-wrap">{squares}</div>;
};

export default Board;
