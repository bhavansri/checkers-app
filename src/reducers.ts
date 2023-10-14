import {
  CpuMovePossibility,
  GameState,
  Move,
  PlayerPieces,
} from "./utils/constants";
import { checkIfEmpty, getMoveType, isValidBounds } from "./utils/helpers";

type GameAction = {
  type: "cpuMove" | "playerMove";
  movePossibility?: CpuMovePossibility;
  coords?: number[];
  id: string;
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "cpuMove":
      if (action.movePossibility && action.id) {
        return moveCpu(state, action.movePossibility, action.id);
      } else {
        return state;
      }
    case "playerMove":
      if (action.coords && action.id) {
        return movePlayer(state, action.coords, action.id);
      } else {
        return state;
      }
    default:
      return state;
  }
}

function movePlayer(game: GameState, final: number[], id: string) {
  const player = game.playerCheckers;
  const computer = game.computerCheckers;

  const lastMove = getMoveType(player[id].coords, final);
  let removeCheckerCoords: number[] | null = null;
  let removeCheckerKey: string | null = null;

  // if the last move was a hop, remove the correct opponent piece

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

  // update the possible left/right hop coordinates for this piece
  const leftHopCoords: number[] = getLeftHopForPlayer(game, final);
  const rightHopCoords: number[] = getRightHopForPlayer(game, final);

  const updatedPlayer = {
    ...player,
    [id]: {
      coords: final,
      leftHopCoords: leftHopCoords,
      rightHopCoords: rightHopCoords,
      lastMove: lastMove,
    },
  };

  if (removeCheckerKey !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [removeCheckerKey]: removedProperty, ...newComputer } = computer;
    return {
      playerCheckers: updatedPlayer,
      computerCheckers: newComputer,
    };
  } else {
    return {
      playerCheckers: updatedPlayer,
      computerCheckers: computer,
    };
  }
}

function moveCpu(
  game: GameState,
  movePossibility: CpuMovePossibility,
  id: string
) {
  let newGame: GameState;
  const player = game.playerCheckers;
  const computer = game.computerCheckers;

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
    const { [removeCheckerKey]: removedProperty, ...newPlayer } = player;

    newGame = {
      playerCheckers: newPlayer,
      computerCheckers: updatedComputer,
    };
  } else {
    newGame = {
      playerCheckers: player,
      computerCheckers: updatedComputer,
    };
  }

  newGame.playerCheckers = updatePlayerHops(newGame);

  return newGame;
}

function updatePlayerHops(newGame: GameState): PlayerPieces {
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
}

const getLeftHopForPlayer = (game: GameState, coords: number[]): number[] => {
  const leftHopCoords = [coords[0] - 2, coords[1] - 2];
  const computer = game.computerCheckers;

  if (
    isValidBounds(leftHopCoords) === false ||
    isEmptySquare(game, leftHopCoords) === false
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

const getRightHopForPlayer = (game: GameState, coords: number[]): number[] => {
  const rightHopCoords = [coords[0] + 2, coords[1] - 2];
  const computer = game.computerCheckers;

  if (
    isValidBounds(rightHopCoords) === false ||
    isEmptySquare(game, rightHopCoords) === false
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

const isEmptySquare = (game: GameState, coord: number[]) => {
  return checkIfEmpty(game, coord);
};
