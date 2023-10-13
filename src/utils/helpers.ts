import { Move } from "./Constants";

export function isValidBounds(pos: number[]) {
  if (pos[0] < 0 || pos[0] >= 8 || pos[1] < 0 || pos[0] >= 8) {
    return false;
  } else {
    return true;
  }
}

export function getMoveType(initial: number[], final: number[]) {
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
