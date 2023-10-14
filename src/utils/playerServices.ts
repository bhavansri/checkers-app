import { GameState, PlayerPieces } from "./constants";
import { checkIfEmpty, isValidBounds } from "./helpers";

export const canMoveChecker = (
  game: GameState,
  final: number[],
  id: string
): boolean => {
  const player = game.playerCheckers;

  if (player[id] !== null && player[id] !== undefined) {
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
      checkIfEmpty(game, final) === false
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

export const updatePlayerHops = (newGame: GameState): PlayerPieces => {
  let newPlayerPieces: PlayerPieces = newGame.playerCheckers;

  for (const id in newPlayerPieces) {
    const player = newPlayerPieces[id];
    const coords = player.coords;
    const currLeftHopCoords = player.leftHopCoords;
    const currRightHopCoords = player.rightHopCoords;
    const leftHopCoords: number[] = getLeftHopForPlayer(newGame, coords);
    const rightHopCoords: number[] = getRightHopForPlayer(newGame, coords);

    if (
      leftHopCoords.length !== currLeftHopCoords.length ||
      rightHopCoords.length !== currRightHopCoords.length
    ) {
      newPlayerPieces = {
        ...newPlayerPieces,
        [id]: {
          coords: coords,
          leftHopCoords: leftHopCoords,
          rightHopCoords: rightHopCoords,
          lastMove: player.lastMove,
        },
      };
    }
  }

  return newPlayerPieces;
};

export const getLeftHopForPlayer = (
  game: GameState,
  coords: number[]
): number[] => {
  const leftHopCoords = [coords[0] - 2, coords[1] - 2];
  const computer = game.computerCheckers;

  if (
    isValidBounds(leftHopCoords) === false ||
    checkIfEmpty(game, leftHopCoords) === false
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
};

export const getRightHopForPlayer = (
  game: GameState,
  coords: number[]
): number[] => {
  const rightHopCoords = [coords[0] + 2, coords[1] - 2];
  const computer = game.computerCheckers;

  if (
    isValidBounds(rightHopCoords) === false ||
    checkIfEmpty(game, rightHopCoords) === false
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
};
