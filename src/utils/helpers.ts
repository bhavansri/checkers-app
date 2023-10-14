import { GameState, Move } from "./constants";

export function isValidBounds(pos: number[]) {
  if (pos[0] < 0 || pos[0] > 7 || pos[1] < 0 || pos[1] > 7) {
    return false;
  } else {
    return true;
  }
}

export function checkIfEmpty(game: GameState, destination: number[]): boolean {
  for (const key in game.playerCheckers) {
    const piece = game.playerCheckers[key];
    const playerXY = piece.coords;
    if (playerXY[0] === destination[0] && playerXY[1] === destination[1]) {
      return false;
    }
  }

  for (const key in game.computerCheckers) {
    const piece = game.computerCheckers[key];
    const cpuCoords = piece.coords;
    if (cpuCoords[0] === destination[0] && cpuCoords[1] === destination[1]) {
      return false;
    }
  }

  return true;
}

export function getPlayerMoveType(initial: number[], final: number[]) {
  if (initial[0] + 1 === final[0] && final[1] === initial[1] - 1) {
    return Move.right;
  } else if (initial[0] - 1 === final[0] && final[1] === initial[1] - 1) {
    return Move.left;
  } else if (initial[0] + 2 === final[0] && final[1] === initial[1] - 2) {
    return Move.hopRight;
  } else if (initial[0] - 2 === final[0] && final[1] === initial[1] - 2) {
    return Move.hopLeft;
  } else {
    return Move.none;
  }
}

export function getComputerMoveType(initial: number[], final: number[]) {
  if (initial[0] + 1 === final[0] && final[1] === initial[1] + 1) {
    return Move.right;
  } else if (initial[0] - 1 === final[0] && final[1] === initial[1] + 1) {
    return Move.left;
  } else if (initial[0] + 2 === final[0] && final[1] === initial[1] + 2) {
    return Move.hopRight;
  } else if (initial[0] - 2 === final[0] && final[1] === initial[1] + 2) {
    return Move.hopLeft;
  } else {
    return Move.none;
  }
}

export function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}
