import { useCallback, useEffect, useReducer, useState } from "react";
import Board from "./components/Board";
import { defaultGame } from "./utils/constants";
import { checkIfEmpty, isValidBounds, timeout } from "./utils/helpers";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { gameReducer } from "./reducers";

function App() {
  const [game, dispatch] = useReducer(gameReducer, defaultGame);
  const [cpuTurn, setCpuTurn] = useState(false);

  const isEmptySquare = useCallback(
    (coord: number[]) => {
      return checkIfEmpty(game, coord);
    },
    [game]
  );

  useEffect(() => {
    console.log("Computer checkers:");
    for (const key in game.computerCheckers) {
      const checker = game.computerCheckers[key];
      console.log(`ID: ${key}, coords: ${checker.coords}`);
    }

    console.log("Player checkers");

    for (const key in game.playerCheckers) {
      const checker = game.playerCheckers[key];
      console.log(`ID: ${key}, coords: ${checker.coords}`);
    }
  }, [game]);

  const moveChecker = (final: number[], id: string) => {
    if (!cpuTurn) {
      dispatch({ type: "playerMove", coords: final, id: id });

      setCpuTurn(true);
    }
  };

  const moveCpu = useCallback(
    async (final: number[], id: string) => {
      if (cpuTurn) {
        await timeout(1500);
        dispatch({
          type: "cpuMove",
          coords: final,
          id: id,
        });
      }

      setCpuTurn(false);
    },
    [cpuTurn]
  );

  const canMoveChecker = (final: number[], id: string): boolean => {
    const player = game.playerCheckers;

    if (!cpuTurn && player[id] !== null && player[id] !== undefined) {
      const initial: number[] = player[id].coords;
      const leftHopCoords = player[id].leftHopCoords;
      const rightHopCoords = player[id].rightHopCoords;

      if (
        leftHopCoords.length > 0 &&
        leftHopCoords[0] === final[0] &&
        leftHopCoords[1] === final[1]
      ) {
        return true;
      } else if (
        rightHopCoords.length > 0 &&
        rightHopCoords[0] === final[0] &&
        rightHopCoords[1] === final[1]
      ) {
        return true;
      } else if (
        leftHopCoords.length > 0 ||
        rightHopCoords.length > 0 ||
        isEmptySquare(final) === false
      ) {
        return false;
      } else {
        if (
          (initial[0] + 1 == final[0] && initial[1] - 1 == final[1]) ||
          (initial[0] - 1 == final[0] && initial[1] - 1 == final[1])
        ) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  };

  const fetchRandomCpu = useCallback((): string => {
    const computer = game.computerCheckers;
    const randomIndex = Math.floor(
      Math.random() * Object.keys(computer).length
    );
    const randomKey = Object.keys(computer)[randomIndex];
    return randomKey;
  }, [game]);

  const generateCpuMove = useCallback(async () => {
    if (cpuTurn) {
      // fetch a random computer piece and store all possible moves in an array.
      // if this array is not empty, perform a move and exit the loop.
      // if it's empty, refetch a random piece and try again.

      let movedPiece = false;

      while (movedPiece == false) {
        let cpuID = "";

        for (const key in game.computerCheckers) {
          if (
            game.computerCheckers[key].leftHopCoords.length > 0 ||
            game.computerCheckers[key].rightHopCoords.length > 0
          ) {
            cpuID = key;
            break;
          }
        }

        if (cpuID.length === 0) {
          cpuID = fetchRandomCpu();
        }

        const randomComputerChecker = game.computerCheckers[cpuID];
        const currentCoords: number[] = randomComputerChecker.coords;

        if (randomComputerChecker.leftHopCoords.length > 0) {
          moveCpu(randomComputerChecker.leftHopCoords, cpuID);
          movedPiece = true;
        } else if (randomComputerChecker.rightHopCoords.length > 0) {
          moveCpu(randomComputerChecker.rightHopCoords, cpuID);
          movedPiece = true;
        } else {
          const possibilities = [];
          const left = [currentCoords[0] - 1, currentCoords[1] + 1];
          const right = [currentCoords[0] + 1, currentCoords[1] + 1];

          if (isValidBounds(left) && isEmptySquare(left)) {
            possibilities.push(left);
          }

          if (isValidBounds(right) && isEmptySquare(right)) {
            possibilities.push(right);
          }

          const randomMove =
            possibilities[Math.floor(Math.random() * possibilities.length)];

          if (randomMove) {
            await moveCpu(randomMove, cpuID);
            movedPiece = true;
          }
        }
      }
    }
  }, [isEmptySquare, game, cpuTurn, fetchRandomCpu, moveCpu]);

  useEffect(() => {
    generateCpuMove();
  }, [generateCpuMove]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div style={{ height: "500px", width: "500px" }}>
          <Board
            game={game}
            moveChecker={moveChecker}
            canMoveChecker={canMoveChecker}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
