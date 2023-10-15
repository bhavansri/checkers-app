import BoardSquare from "./BoardSquare";
import { CpuPiece, PlayerPiece } from "./CheckerPiece";
import { ComputerPieces, GameState, PlayerPieces } from "../utils/constants";
import { useEffect, useReducer, useState } from "react";
import { timeout } from "../utils/helpers";
import {
  fetchRandomCpuChecker,
  generateCpuDestination,
} from "../utils/cpuServices";
import { gameReducer } from "../utils/reducers";
import { canMoveChecker } from "../utils/playerServices";

type BoardProps = {
  initialGame: GameState;
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

const Board = ({ initialGame }: BoardProps) => {
  const squares = [];
  const [hoverElement, setHoverElement] = useState<string | null>(null);
  const [cpuTurn, setCpuTurn] = useState(false);
  const [game, dispatch] = useReducer(gameReducer, initialGame);

  const onHoverChange = (isHovering: boolean, itemId: string) => {
    isHovering ? setHoverElement(itemId) : setHoverElement(null);
  };

  const moveChecker = (final: number[], id: string) => {
    if (!cpuTurn) {
      dispatch({ type: "playerMove", coords: final, id: id });
      setCpuTurn(true);
    }
  };

  const handleCanMove = (final: number[], id: string): boolean => {
    if (!cpuTurn) {
      return canMoveChecker(game, final, id);
    } else {
      return false;
    }
  };

  useEffect(() => {
    async function randomize() {
      if (cpuTurn) {
        await timeout(1500);
        let movedPiece = false;

        while (movedPiece == false) {
          const cpuID: string = fetchRandomCpuChecker(game);
          const destination: number[] = generateCpuDestination(game, cpuID);

          if (destination.length > 0) {
            dispatch({
              type: "cpuMove",
              coords: destination,
              id: cpuID,
            });
            movedPiece = true;
          }
        }
        setCpuTurn(false);
      }
    }

    randomize();
  }, [game, cpuTurn]);

  for (let i = 0; i < 64; i++) {
    squares.push(
      renderSquare(
        i,
        game,
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
