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
      return canMoveChecker(game.present, final, id);
    } else {
      return false;
    }
  };

  const handleUndo = () => {
    dispatch({ type: "undo" });
  };

  const handleRedo = () => {
    dispatch({ type: "redo" });
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
          const cpuID: string = fetchRandomCpuChecker(game.present);
          const destination: number[] = generateCpuDestination(
            game.present,
            cpuID
          );

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
      <div className="flex items-start gap-10 mb-5">
        <button
          className="text-white bg-gray-800 hover:bg-gray-900 rounded-lg px-5 py-2.5"
          onClick={handleOnReset}
        >
          Reset Game
        </button>
        <div className="flex gap-5">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleUndo}
              type="button"
              className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
            >
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 7 1 4l3-3m0 12h6.5a4.5 4.5 0 1 0 0-9H2"
                />
              </svg>
            </button>
            <p className="uppercase text-sm font-semibold">Undo</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleRedo}
              type="button"
              className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2"
            >
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m12 7 3-3-3-3m0 12H5.5a4.5 4.5 0 1 1 0-9H14"
                />
              </svg>
            </button>
            <p className="uppercase text-sm font-semibold">Redo</p>
          </div>
        </div>
      </div>
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
