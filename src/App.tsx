import { useCallback, useEffect, useReducer, useState } from "react";
import Board from "./components/Board";
import { CpuMovePossibility, Move, defaultGame } from "./utils/constants";
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

  const getLeftHopForCPU = useCallback(
    (coords: number[]): number[] => {
      const leftHopCoords = [coords[0] - 2, coords[1] + 2];
      const player = game.playerCheckers;

      if (
        isValidBounds(leftHopCoords) === false ||
        isEmptySquare(leftHopCoords) === false
      ) {
        return [];
      }

      for (const key in player) {
        const playerCoords = player[key].coords;

        if (
          coords[0] - 1 === playerCoords[0] &&
          playerCoords[0] - 1 === leftHopCoords[0] &&
          coords[1] + 1 === playerCoords[1] &&
          playerCoords[1] + 1 === leftHopCoords[1]
        ) {
          return leftHopCoords;
        }
      }

      return [];
    },
    [isEmptySquare, game]
  );

  const getRightHopForCPU = useCallback(
    (coords: number[]): number[] => {
      const rightHopCoords = [coords[0] + 2, coords[1] + 2];
      const player = game.playerCheckers;

      if (
        isValidBounds(rightHopCoords) === false ||
        isEmptySquare(rightHopCoords) === false
      ) {
        return [];
      }

      for (const key in player) {
        const playerCoords = player[key].coords;

        if (
          coords[0] + 1 === playerCoords[0] &&
          playerCoords[0] + 1 === rightHopCoords[0] &&
          coords[1] + 1 === playerCoords[1] &&
          playerCoords[1] + 1 === rightHopCoords[1]
        ) {
          return rightHopCoords;
        }
      }

      return [];
    },
    [isEmptySquare, game]
  );

  const moveChecker = (final: number[], id: string) => {
    dispatch({ type: "playerMove", coords: final, id: id });
    setCpuTurn(true);
  };

  const moveCpu = useCallback(
    async (movePossibility: CpuMovePossibility, id: string) => {
      if (cpuTurn) {
        await timeout(1500);
        dispatch({
          type: "cpuMove",
          movePossibility: movePossibility,
          id: id,
        });
      }

      setCpuTurn(false);
    },
    [cpuTurn]
  );

  const canMoveChecker = (final: number[], id: string): boolean => {
    const player = game.playerCheckers;
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
  };

  const fetchRandomCpu = useCallback((): string => {
    const computer = game.computerCheckers;
    const randomIndex = Math.floor(
      Math.random() * Object.keys(computer).length
    );
    const randomKey = Object.keys(computer)[randomIndex];
    return randomKey;
  }, [game]);

  const canMoveCpu = useCallback(
    (final: number[], id: string): boolean => {
      const computer = game.computerCheckers;
      const initial: number[] = computer[id].coords;

      if (isValidBounds(final) === false || isEmptySquare(final) === false) {
        return false;
      }

      if (
        (initial[0] + 1 == final[0] && initial[1] + 1 == final[1]) ||
        (initial[0] - 1 == final[0] && initial[1] + 1 == final[1])
      ) {
        return true;
      } else {
        return false;
      }
    },
    [game, isEmptySquare]
  );

  const generateCpuMove = useCallback(async () => {
    if (cpuTurn) {
      // fetch a random computer piece and store all possible moves in an array.
      // if this array is not empty, perform a move and exit the loop.
      // if it's empty, refetch a random piece and try again.

      let movedPiece = false;

      while (movedPiece == false) {
        const piece: string = fetchRandomCpu();
        const coords: number[] = game.computerCheckers[piece].coords;
        const leftCoords: number[] = [coords[0] - 1, coords[1] + 1];
        const rightCoords: number[] = [coords[0] + 1, coords[1] + 1];
        const leftHopCoords: number[] = getLeftHopForCPU(coords);
        const rightHopCoords: number[] = getRightHopForCPU(coords);
        const possiblities: CpuMovePossibility[] = [];

        if (canMoveCpu(leftCoords, piece)) {
          possiblities.push({ dest: leftCoords, move: Move.left });
        }

        if (canMoveCpu(rightCoords, piece)) {
          possiblities.push({ dest: rightCoords, move: Move.right });
        }

        if (leftHopCoords.length > 0) {
          possiblities.push({ dest: leftHopCoords, move: Move.hopLeft });
        }

        if (rightHopCoords.length > 0) {
          possiblities.push({ dest: rightHopCoords, move: Move.hopRight });
        }

        if (possiblities.length > 0) {
          await moveCpu(
            possiblities[Math.floor(Math.random() * possiblities.length)],
            piece
          );
          movedPiece = true;
        } else {
          movedPiece = false;
        }
      }
    }
  }, [
    canMoveCpu,
    game,
    cpuTurn,
    fetchRandomCpu,
    getLeftHopForCPU,
    getRightHopForCPU,
    moveCpu,
  ]);

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
