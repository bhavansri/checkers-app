import { useCallback, useEffect, useState } from "react";
import Board from "./components/Board";

export type PlayerCheckerProps = {
  coords: number[];
  offenseExists: boolean;
};

const playerCheckers: { [id: string]: PlayerCheckerProps } = {
  "1": { coords: [0, 7], offenseExists: false },
  "2": { coords: [2, 7], offenseExists: false },
  "3": { coords: [4, 7], offenseExists: false },
  "4": { coords: [6, 7], offenseExists: false },
  "5": { coords: [1, 6], offenseExists: false },
  "6": { coords: [3, 6], offenseExists: false },
  "7": { coords: [5, 6], offenseExists: false },
  "8": { coords: [7, 6], offenseExists: false },
  "9": { coords: [0, 5], offenseExists: false },
  "10": { coords: [2, 5], offenseExists: false },
  "11": { coords: [4, 5], offenseExists: false },
  "12": { coords: [6, 5], offenseExists: false },
};

const computerCheckers: { [id: string]: number[] } = {
  "1": [1, 0],
  "2": [3, 0],
  "3": [5, 0],
  "4": [7, 0],
  "5": [0, 1],
  "6": [2, 1],
  "7": [4, 1],
  "8": [6, 1],
  "9": [1, 2],
  "10": [3, 2],
  "11": [5, 2],
  "12": [7, 2],
};

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

  const canPerformOffense = useCallback(
    (initial: number[], final: number[]): boolean => {
      if (isValidBounds(final) === false || isEmptySquare(final) === false) {
        return false;
      }

      for (const key in computer) {
        const cpuXY = computer[key];

        const rightHopExists =
          initial[0] + 1 === cpuXY[0] &&
          cpuXY[0] + 1 === final[0] &&
          initial[1] - 1 === cpuXY[1] &&
          cpuXY[1] - 1 === final[1];

        const leftHopExists =
          initial[0] - 1 === cpuXY[0] &&
          cpuXY[0] - 1 === final[0] &&
          initial[1] - 1 === cpuXY[1] &&
          cpuXY[1] - 1 === final[1];

        if (rightHopExists || leftHopExists) {
          return true;
        }
      }

      return false;
    },
    [computer, isEmptySquare]
  );

  useEffect(() => {
    for (const key in player) {
      const playerXY = player[key].coords;
      const offenseRight = [playerXY[0] + 2, playerXY[1] - 2];
      const offenseLeft = [playerXY[0] - 2, playerXY[1] - 2];
      let offenseExists = false;

      if (canPerformOffense(playerXY, offenseLeft)) {
        offenseExists = true;
      }

      if (canPerformOffense(playerXY, offenseRight)) {
        offenseExists = true;
      }

      if (offenseExists !== player[key].offenseExists) {
        setPlayer((prevPlayer) => ({
          ...prevPlayer,
          [key]: {
            coords: playerXY,
            offenseExists: offenseExists,
          },
        }));
      }
    }

    console.log(player);
  }, [player, computer, canPerformOffense, isEmptySquare]);

  function moveChecker(final: number[], id: string) {
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      [id]: {
        coords: final,
        offenseExists: prevPlayer[id].offenseExists,
      },
    }));

    setCpuTurn(true);
  }

  function moveCpu(final: number[], id: string) {
    setComputer((prevComputer) => ({
      ...prevComputer,
      [id]: final,
    }));

    setCpuTurn(false);
  }

  function canMoveChecker(final: number[], id: string): boolean {
    const initial: number[] = player[id].coords;
    const offenseExists = player[id].offenseExists;

    if (offenseExists) {
      return canPerformOffense(initial, final);
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
  }

  function fetchRandomCpuPiece(): string {
    return Math.floor(Math.random() * (13 - 1) + 1).toString();
  }

  function isValidBounds(pos: number[]) {
    if (pos[0] < 0 || pos[0] >= 8 || pos[1] < 0 || pos[0] >= 8) {
      return false;
    } else {
      return true;
    }
  }

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
        const piece: string = fetchRandomCpuPiece();
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
  }, [player, cpuTurn, computer]);

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
