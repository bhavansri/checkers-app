import { useCallback, useEffect, useState } from "react";
import Board from "./components/Board";
import { Move, computerCheckers, playerCheckers } from "./utils/Constants";
import { getMoveType, isValidBounds } from "./utils/helpers";

function App() {
  const [player, setPlayer] = useState(playerCheckers);
  const [cpuTurn, setCpuTurn] = useState(false);
  const [computer, setComputer] = useState(computerCheckers);

  const isEmptySquare = useCallback(
    (coord: number[]) => {
      for (const key in player) {
        const playerXY = player[key].coords;
        if (playerXY[0] === coord[0] && playerXY[1] === coord[1]) {
          return false;
        }
      }

      for (const key in computer) {
        const cpuXY = computer[key];
        if (cpuXY[0] === coord[0] && cpuXY[1] === coord[1]) {
          return false;
        }
      }

      return true;
    },
    [computer, player]
  );

  const getLeftHop = useCallback(
    (coords: number[]): number[] => {
      const leftHopCoords = [coords[0] - 2, coords[1] - 2];

      if (
        isValidBounds(leftHopCoords) === false ||
        isEmptySquare(leftHopCoords) === false
      ) {
        return [];
      }

      for (const key in computer) {
        const cpuXY = computer[key];

        if (
          coords[0] - 1 === cpuXY[0] &&
          cpuXY[0] - 1 === leftHopCoords[0] &&
          coords[1] - 1 === cpuXY[1] &&
          cpuXY[1] - 1 === leftHopCoords[1]
        ) {
          return leftHopCoords;
        }
      }

      return [];
    },
    [computer, isEmptySquare]
  );

  const getRightHop = useCallback(
    (coords: number[]): number[] => {
      const rightHopCoords = [coords[0] + 2, coords[1] - 2];

      if (
        isValidBounds(rightHopCoords) === false ||
        isEmptySquare(rightHopCoords) === false
      ) {
        return [];
      }

      for (const key in computer) {
        const cpuXY = computer[key];

        if (
          coords[0] + 1 === cpuXY[0] &&
          cpuXY[0] + 1 === rightHopCoords[0] &&
          coords[1] - 1 === cpuXY[1] &&
          cpuXY[1] - 1 === rightHopCoords[1]
        ) {
          return rightHopCoords;
        }
      }

      return [];
    },
    [computer, isEmptySquare]
  );

  useEffect(() => {
    for (const key in player) {
      const playerXY = player[key].coords;
      const leftHopCoords: number[] = getLeftHop(playerXY);
      const rightHopCoords: number[] = getRightHop(playerXY);

      if (
        leftHopCoords.length !== player[key].leftHopCoords.length ||
        rightHopCoords.length !== player[key].rightHopCoords.length
      ) {
        setPlayer((prevPlayer) => ({
          ...prevPlayer,
          [key]: {
            coords: playerXY,
            leftHopCoords: leftHopCoords,
            rightHopCoords: rightHopCoords,
            lastMove: player[key].lastMove,
          },
        }));
      }
    }
  }, [player, computer, isEmptySquare, getLeftHop, getRightHop]);

  const moveChecker = useCallback(
    (final: number[], id: string) => {
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
          if (
            computer[key][0] === removeCheckerCoords[0] &&
            computer[key][1] === removeCheckerCoords[1]
          ) {
            removeCheckerKey = key;
          }
        }
      }

      if (removeCheckerKey !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [removeCheckerKey]: removedProperty, ...newComputer } =
          computer;
        setComputer(newComputer);
      }

      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        [id]: {
          coords: final,
          leftHopCoords: prevPlayer[id].leftHopCoords,
          rightHopCoords: prevPlayer[id].rightHopCoords,
          lastMove: lastMove,
        },
      }));

      setCpuTurn(true);
    },
    [computer, player]
  );

  const moveCpu = useCallback((final: number[], id: string) => {
    setTimeout(function () {
      setComputer((prevComputer) => ({
        ...prevComputer,
        [id]: final,
      }));

      setCpuTurn(false);
    }, 1500);
  }, []);

  const canMoveChecker = useCallback(
    (final: number[], id: string): boolean => {
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
      } else if (leftHopCoords.length > 0 || rightHopCoords.length > 0) {
        return false;
      } else {
        if (isEmptySquare(final) === false) {
          return false;
        }

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
    [isEmptySquare, player]
  );

  const fetchRandomCpu = useCallback((): string => {
    const randomIndex = Math.floor(
      Math.random() * Object.keys(computer).length
    );
    const randomKey = Object.keys(computer)[randomIndex];
    return randomKey;
  }, [computer]);

  useEffect(() => {
    console.log(player);
  }, [player]);

  useEffect(() => {
    function canMoveCpu(final: number[], id: string): boolean {
      const initial: number[] = computer[id];

      if (isValidBounds(final) === false) {
        return false;
      }

      for (const key in computer) {
        if (computer[key][0] === final[0] && computer[key][1] === final[1]) {
          return false;
        }
      }

      for (const key in player) {
        if (
          player[key].coords[0] === final[0] &&
          player[key].coords[1] === final[1]
        ) {
          return false;
        }
      }

      if (
        (initial[0] + 1 == final[0] && initial[1] + 1 == final[1]) ||
        (initial[0] - 1 == final[0] && initial[1] + 1 == final[1])
      ) {
        return true;
      } else {
        return false;
      }
    }

    if (cpuTurn) {
      let movedPiece = false;

      while (movedPiece == false) {
        const piece: string = fetchRandomCpu();
        const coords: number[] = computer[piece];

        const possiblities = [
          [coords[0] - 1, coords[1] + 1],
          [coords[0] + 1, coords[1] + 1],
        ];

        for (let i = 0; i < possiblities.length; i++) {
          if (canMoveCpu(possiblities[i], piece)) {
            moveCpu(possiblities[i], piece);
            movedPiece = true;
            break;
          }
        }
      }
    }
  }, [player, cpuTurn, computer, fetchRandomCpu, moveCpu]);

  return (
    <div>
      <div style={{ height: "500px", width: "500px" }}>
        <Board
          player={player}
          computer={computer}
          moveChecker={moveChecker}
          canMoveChecker={canMoveChecker}
        />
      </div>
    </div>
  );
}

export default App;
