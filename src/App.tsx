import { useCallback, useEffect, useState } from "react";
import Board from "./components/Board";
import {
  CpuMovePossibility,
  GameState,
  Move,
  defaultGame,
} from "./utils/constants";
import { checkIfEmpty, getMoveType, isValidBounds } from "./utils/helpers";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const [game, setGame] = useState(defaultGame);
  const [cpuTurn, setCpuTurn] = useState(false);
  const [hoverElement, setHoverElement] = useState<string | null>(null);

  const onHoverChange = (isHovering: boolean, itemId: string) => {
    isHovering ? setHoverElement(itemId) : setHoverElement(null);
  };

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

  const getLeftHopForPlayer = useCallback(
    (coords: number[]): number[] => {
      const leftHopCoords = [coords[0] - 2, coords[1] - 2];
      const computer = game.computerCheckers;

      if (
        isValidBounds(leftHopCoords) === false ||
        isEmptySquare(leftHopCoords) === false
      ) {
        return [];
      }

      for (const key in computer) {
        const cpuCoords = computer[key].coords;

        if (
          coords[0] - 1 === cpuCoords[0] &&
          cpuCoords[0] - 1 === leftHopCoords[0] &&
          coords[1] - 1 === cpuCoords[1] &&
          cpuCoords[1] - 1 === leftHopCoords[1]
        ) {
          return leftHopCoords;
        }
      }

      return [];
    },
    [game, isEmptySquare]
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

  const getRightHopForPlayer = useCallback(
    (coords: number[]): number[] => {
      const rightHopCoords = [coords[0] + 2, coords[1] - 2];
      const computer = game.computerCheckers;

      if (
        isValidBounds(rightHopCoords) === false ||
        isEmptySquare(rightHopCoords) === false
      ) {
        return [];
      }

      for (const key in computer) {
        const cpuCoords = computer[key].coords;

        if (
          coords[0] + 1 === cpuCoords[0] &&
          cpuCoords[0] + 1 === rightHopCoords[0] &&
          coords[1] - 1 === cpuCoords[1] &&
          cpuCoords[1] - 1 === rightHopCoords[1]
        ) {
          return rightHopCoords;
        }
      }

      return [];
    },
    [game, isEmptySquare]
  );

  useEffect(() => {
    const player = game.playerCheckers;
    for (const key in player) {
      const playerXY = player[key].coords;
      const leftHopCoords: number[] = getLeftHopForPlayer(playerXY);
      const rightHopCoords: number[] = getRightHopForPlayer(playerXY);

      if (
        leftHopCoords.length !== player[key].leftHopCoords.length ||
        rightHopCoords.length !== player[key].rightHopCoords.length
      ) {
        const newPieces = {
          ...player,
          [key]: {
            coords: playerXY,
            leftHopCoords: leftHopCoords,
            rightHopCoords: rightHopCoords,
            lastMove: player[key].lastMove,
          },
        };

        setGame((prevGame: GameState) => ({
          computerCheckers: prevGame.computerCheckers,
          playerCheckers: newPieces,
        }));
      }
    }
  }, [game, isEmptySquare, getLeftHopForPlayer, getRightHopForPlayer]);

  const moveChecker = useCallback(
    (final: number[], id: string) => {
      const player = game.playerCheckers;
      const computer = game.computerCheckers;

      const lastMove = getMoveType(player[id].coords, final);
      let removeCheckerCoords: number[] | null = null;
      let removeCheckerKey: string | null = null;

      if (lastMove == Move.hopRight) {
        removeCheckerCoords = [final[0] - 1, final[1] + 1];
      } else if (lastMove == Move.hopLeft) {
        removeCheckerCoords = [final[0] + 1, final[1] + 1];
      }

      if (removeCheckerCoords !== null) {
        for (const key in computer) {
          const coords = computer[key].coords;
          if (
            coords[0] === removeCheckerCoords[0] &&
            coords[1] === removeCheckerCoords[1]
          ) {
            removeCheckerKey = key;
          }
        }
      }

      const updatedPlayer = {
        ...player,
        [id]: {
          coords: final,
          leftHopCoords: player[id].leftHopCoords,
          rightHopCoords: player[id].rightHopCoords,
          lastMove: lastMove,
        },
      };

      if (removeCheckerKey !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [removeCheckerKey]: removedProperty, ...newComputer } =
          computer;
        setGame({
          playerCheckers: updatedPlayer,
          computerCheckers: newComputer,
        });
      } else {
        setGame({
          playerCheckers: updatedPlayer,
          computerCheckers: computer,
        });
      }

      setCpuTurn(true);
    },
    [game]
  );

  const moveCpu = useCallback(
    (movePossibility: CpuMovePossibility, id: string) => {
      const player = game.playerCheckers;
      const computer = game.computerCheckers;

      if (cpuTurn) {
        setTimeout(function () {
          const final = movePossibility.dest;
          const move = movePossibility.move;
          let removeCheckerCoords: number[] | null = null;
          let removeCheckerKey: string | null = null;

          if (move == Move.hopRight) {
            removeCheckerCoords = [final[0] - 1, final[1] - 1];
          } else if (move == Move.hopLeft) {
            removeCheckerCoords = [final[0] + 1, final[1] - 1];
          }

          if (removeCheckerCoords !== null) {
            for (const key in player) {
              const coords = player[key].coords;
              if (
                coords[0] === removeCheckerCoords[0] &&
                coords[1] === removeCheckerCoords[1]
              ) {
                removeCheckerKey = key;
              }
            }
          }

          const updatedComputer = {
            ...computer,
            [id]: {
              coords: movePossibility.dest,
              lastMove: movePossibility.move,
            },
          };

          if (removeCheckerKey !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [removeCheckerKey]: removedProperty, ...newPlayer } =
              player;
            setGame({
              playerCheckers: newPlayer,
              computerCheckers: updatedComputer,
            });
          } else {
            setGame({
              playerCheckers: player,
              computerCheckers: updatedComputer,
            });
          }
        }, 1500);
      }

      setCpuTurn(false);
    },
    [game, cpuTurn]
  );

  const canMoveChecker = useCallback(
    (final: number[], id: string): boolean => {
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
    },
    [isEmptySquare, game]
  );

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

  const generateCpuMove = useCallback(() => {
    if (cpuTurn) {
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

        for (let i = 0; i < possiblities.length; i++) {
          moveCpu(possiblities[i], piece);
          movedPiece = true;
          break;
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
            onHoverChange={onHoverChange}
            hoverElement={hoverElement}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
