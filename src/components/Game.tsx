import { useEffect, useReducer, useState } from "react";
import { gameReducer } from "../utils/reducers";
import { canMoveChecker } from "../utils/playerServices";
import { fetchLocalCache, timeout } from "../utils/helpers";
import {
  fetchRandomCpuChecker,
  generateCpuDestination,
} from "../utils/cpuServices";
import Board from "./Board";
import { GameState, StorageKeys } from "../utils/constants";
import Timer from "./Timer";
import VictoryModal from "./VictoryModal";

type GameProps = {
  gameState: GameState;
};

function Game({ gameState }: GameProps) {
  const [cpuTurn, setCpuTurn] = useState(
    fetchLocalCache(StorageKeys.cpuTurn) ?? false
  );
  const [game, dispatch] = useReducer(
    gameReducer,
    fetchLocalCache(StorageKeys.game) ?? gameState
  );
  const [startTime, setStartTime] = useState<string>(
    fetchLocalCache(StorageKeys.timer) ?? new Date().toString()
  );

  const computerScore = 12 - Object.keys(game.present.playerCheckers).length;
  const playerScore = 12 - Object.keys(game.present.computerCheckers).length;

  const movePlayer = (final: number[], id: string) => {
    if (!cpuTurn) {
      dispatch({ type: "playerMove", coords: final, id: id });
      setCpuTurn(true);
    }
  };

  const handleCanMovePlayer = (final: number[], id: string): boolean => {
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
    setStartTime(new Date().toString());
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

  useEffect(() => {
    localStorage.setItem(StorageKeys.timer, JSON.stringify(startTime));
  }, [startTime]);

  return (
    <div className="m-5">
      <VictoryModal
        computerScore={computerScore}
        playerScore={playerScore}
        onReset={handleOnReset}
      />
      <div className="flex items-start gap-10 mb-5">
        <button
          className="text-white bg-gray-800 hover:bg-gray-900 rounded-lg px-5 py-2.5"
          onClick={handleOnReset}
        >
          Reset
        </button>
        <div className="flex gap-10 w-[500px]">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleUndo}
              type="button"
              className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center"
              data-testid="undo-button"
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
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
              data-testid="redo-button"
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m12 7 3-3-3-3m0 12H5.5a4.5 4.5 0 1 1 0-9H14"
                />
              </svg>
            </button>
            <p className="uppercase text-sm font-semibold">Redo</p>
          </div>
          <div className="text-3xl font-semibold flex gap-4">
            <p className="text-black" data-testid="player-score">
              {playerScore}
            </p>
            <p className="text-gray-500">-</p>
            <p className="text-red-600" data-testid="cpu-score">
              {computerScore}
            </p>
          </div>
          <Timer startTime={startTime} />
        </div>
      </div>
      <div className="mb-5 text-blue-700 font-semibold">
        <p data-testid="player-move-count">{`# of player moves: ${game.present.playerMoveCount}`}</p>
        <p data-testid="cpu-move-count">{`# of computer moves: ${game.present.cpuMoveCount}`}</p>
      </div>
      <div className="h-[500px] w-[500px]">
        <Board
          gameState={game}
          movePlayer={movePlayer}
          handleCanMovePlayer={handleCanMovePlayer}
        />
      </div>
    </div>
  );
}

export default Game;
