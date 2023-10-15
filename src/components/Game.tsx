import { useEffect, useReducer, useState } from "react";
import { gameReducer } from "../utils/reducers";
import { canMoveChecker } from "../utils/playerServices";
import { timeout } from "../utils/helpers";
import {
  fetchRandomCpuChecker,
  generateCpuDestination,
} from "../utils/cpuServices";
import Board from "./Board";
import { GameState } from "../utils/constants";

type GameProps = {
  gameState: GameState;
};

function Game({ gameState }: GameProps) {
  const [cpuTurn, setCpuTurn] = useState(false);
  const [game, dispatch] = useReducer(gameReducer, gameState);

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

  return (
    <div>
      <div style={{ height: "500px", width: "500px" }}>
        <Board
          gameState={game}
          moveChecker={moveChecker}
          handleCanMove={handleCanMove}
        />
      </div>
    </div>
  );
}

export default Game;
