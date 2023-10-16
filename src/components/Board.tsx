import BoardSquare from "./BoardSquare";
import { CpuPiece, PlayerPiece } from "./CheckerPiece";
import {
  ComputerCheckers,
  GameState,
  PlayerCheckers,
} from "../utils/constants";
import { useState } from "react";

type BoardProps = {
  gameState: GameState;
  movePlayer: (final: number[], id: string) => void;
  handleCanMovePlayer: (final: number[], id: string) => boolean;
};

function renderSquare(
  i: number,
  game: GameState,
  movePlayer: (final: number[], id: string) => void,
  canMovePlayer: (final: number[], id: string) => boolean,
  hoveringId: string | null,
  onHoverChange: (isHovering: boolean, itemId: string) => void
) {
  const x = i % 8;
  const y = Math.floor(i / 8);

  function showPlayerChecker(checkers: PlayerCheckers): boolean {
    for (const key in checkers) {
      const val: number[] = checkers[key].coords;

      if (val[0] === x && val[1] === y) {
        return true;
      }
    }

    return false;
  }

  function showCpuChecker(checkers: ComputerCheckers): boolean {
    for (const key in checkers) {
      const val: number[] = checkers[key].coords;

      if (val[0] === x && val[1] === y) {
        return true;
      }
    }

    return false;
  }

  function getIdForChecker(checkers: PlayerCheckers): string {
    for (const key in checkers) {
      const val: number[] = checkers[key].coords;

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
        movePlayer={movePlayer}
        canMovePlayer={canMovePlayer}
        hoveringId={hoveringId}
      >
        <>
          {showPlayerChecker(game.present.playerCheckers) ? (
            <PlayerPiece
              id={getIdForChecker(game.present.playerCheckers)}
              onHoverChange={onHoverChange}
            />
          ) : null}
          {showCpuChecker(game.present.computerCheckers) ? <CpuPiece /> : null}
        </>
      </BoardSquare>
    </div>
  );
}

const Board = ({ gameState, movePlayer, handleCanMovePlayer }: BoardProps) => {
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
        movePlayer,
        handleCanMovePlayer,
        hoverElement,
        onHoverChange
      )
    );
  }

  return <div className="h-full w-full flex flex-wrap">{squares}</div>;
};

export default Board;
