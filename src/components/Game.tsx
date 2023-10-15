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

enum StorageKeys {
  game = "game",
  cpuTurn = "cpuTurn",
}

const fetchExistingGameState = (): GameState | null => {
  let savedGame: GameState;
  const localGameState: string | null = localStorage.getItem(StorageKeys.game);

  if (localGameState) {
    savedGame = JSON.parse(localGameState);
  } else {
    return null;
  }

  return savedGame;
};

const fetchExistingTurnState = (): boolean | null => {
  let cpuTurn: boolean;
  const localTurnState: string | null = localStorage.getItem(
    StorageKeys.cpuTurn
  );

  if (localTurnState) {
    cpuTurn = JSON.parse(localTurnState);
  } else {
    return null;
  }

  return cpuTurn;
};

function Game({ gameState }: GameProps) {
  const [cpuTurn, setCpuTurn] = useState(fetchExistingTurnState() ?? false);
  const [game, dispatch] = useReducer(
    gameReducer,
    fetchExistingGameState() ?? gameState
  );

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

  const handleOnReset = () => {
    dispatch({ type: "resetGame" });
    setCpuTurn(false);
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

    localStorage.setItem(StorageKeys.game, JSON.stringify(game));
    localStorage.setItem(StorageKeys.cpuTurn, JSON.stringify(cpuTurn));
  }, [game, cpuTurn]);

  return (
    <div className="m-5">
      <button
        className="text-white bg-gray-800 hover:bg-gray-900 rounded-lg px-5 py-2.5 mr-2 mb-2"
        onClick={handleOnReset}
      >
        Reset Game
      </button>
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
