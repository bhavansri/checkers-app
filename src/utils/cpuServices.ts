import { ComputerPieces, GameState } from "./constants";
import { checkIfEmpty, isValidBounds } from "./helpers";

export const fetchRandomCpuChecker = (game: GameState): string => {
  let randomKey = "";

  for (const key in game.computerCheckers) {
    if (
      game.computerCheckers[key].leftHopCoords.length > 0 ||
      game.computerCheckers[key].rightHopCoords.length > 0
    ) {
      randomKey = key;
      break;
    }
  }

  if (randomKey.length === 0) {
    const computer = game.computerCheckers;
    const randomIndex = Math.floor(
      Math.random() * Object.keys(computer).length
    );
    randomKey = Object.keys(computer)[randomIndex];
  }

  return randomKey;
};

export const generateCpuDestination = (
  game: GameState,
  cpuID: string
): number[] => {
  let destinationCoords: number[] = [];

  // fetch a random computer piece and store all possible moves in an array.
  // if this array is not empty, perform a move and exit the loop.
  // if it's empty, refetch a random piece and try again.
  if (cpuID.length > 0) {
    const randomComputerChecker = game.computerCheckers[cpuID];
    const currentCoords: number[] = randomComputerChecker.coords;

    if (randomComputerChecker.leftHopCoords.length > 0) {
      destinationCoords = randomComputerChecker.leftHopCoords;
    } else if (randomComputerChecker.rightHopCoords.length > 0) {
      destinationCoords = randomComputerChecker.rightHopCoords;
    } else {
      const possibilities = [];
      const left = [currentCoords[0] - 1, currentCoords[1] + 1];
      const right = [currentCoords[0] + 1, currentCoords[1] + 1];

      if (isValidBounds(left) && checkIfEmpty(game, left)) {
        possibilities.push(left);
      }

      if (isValidBounds(right) && checkIfEmpty(game, right)) {
        possibilities.push(right);
      }

      const randomMove =
        possibilities[Math.floor(Math.random() * possibilities.length)];

      if (randomMove) {
        destinationCoords = randomMove;
      }
    }
  }

  return destinationCoords;
};

export const updateComputerHops = (newGame: GameState): ComputerPieces => {
  let newComputerPieces: ComputerPieces = newGame.computerCheckers;

  for (const id in newComputerPieces) {
    const computer = newComputerPieces[id];
    const coords = computer.coords;
    const currLeftHopCoords = computer.leftHopCoords;
    const currRightHopCoords = computer.rightHopCoords;
    const leftHopCoords: number[] = getLeftHopForCPU(newGame, coords);
    const rightHopCoords: number[] = getRightHopForCPU(newGame, coords);

    if (
      leftHopCoords.length !== currLeftHopCoords.length ||
      rightHopCoords.length !== currRightHopCoords.length
    ) {
      newComputerPieces = {
        ...newComputerPieces,
        [id]: {
          coords: coords,
          leftHopCoords: leftHopCoords,
          rightHopCoords: rightHopCoords,
          lastMove: computer.lastMove,
        },
      };
    }
  }

  return newComputerPieces;
};

export const getLeftHopForCPU = (
  game: GameState,
  coords: number[]
): number[] => {
  const leftHopCoords = [coords[0] - 2, coords[1] + 2];
  const player = game.playerCheckers;

  if (
    isValidBounds(leftHopCoords) === false ||
    checkIfEmpty(game, leftHopCoords) === false
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
};

export const getRightHopForCPU = (
  game: GameState,
  coords: number[]
): number[] => {
  const rightHopCoords = [coords[0] + 2, coords[1] + 2];
  const player = game.playerCheckers;

  if (
    isValidBounds(rightHopCoords) === false ||
    checkIfEmpty(game, rightHopCoords) === false
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
};
