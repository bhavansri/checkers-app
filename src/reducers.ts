import {
  ComputerPieces,
  GameState,
  Move,
  PlayerPieces,
} from "./utils/constants";
import {
  checkIfEmpty,
  getComputerMoveType,
  getPlayerMoveType,
  isValidBounds,
} from "./utils/helpers";

type GameAction = {
  type: "cpuMove" | "playerMove";
  coords?: number[];
  id: string;
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "cpuMove":
      if (action.coords && action.id) {
        return moveCpu(state, action.coords, action.id);
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
  let newGame: GameState;
  const player = game.playerCheckers;
  const computer = game.computerCheckers;

  const move = getPlayerMoveType(player[id].coords, final);
  let removeCheckerCoords: number[] | null = null;
  let removeCheckerKey: string | null = null;

  // if this move was a hop, remove the correct opponent piece

  if (move == Move.hopRight) {
    removeCheckerCoords = [final[0] - 1, final[1] + 1];
  } else if (move == Move.hopLeft) {
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

  // update the left/right hop coordinates for this piece
  const leftHopCoords: number[] = getLeftHopForPlayer(game, final);
  const rightHopCoords: number[] = getRightHopForPlayer(game, final);

  const updatedPlayer = {
    ...player,
    [id]: {
      coords: final,
      leftHopCoords: leftHopCoords,
      rightHopCoords: rightHopCoords,
      lastMove: move,
    },
  };

  if (removeCheckerKey !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [removeCheckerKey]: removedProperty, ...newComputer } = computer;
    newGame = {
      playerCheckers: updatedPlayer,
      computerCheckers: newComputer,
    };
  } else {
    newGame = {
      playerCheckers: updatedPlayer,
      computerCheckers: computer,
    };
  }

  newGame.computerCheckers = updateComputerHops(newGame);

  return newGame;
}

function moveCpu(game: GameState, final: number[], id: string) {
  let newGame: GameState;
  const player = game.playerCheckers;
  const computer = game.computerCheckers;

  const move = getComputerMoveType(computer[id].coords, final);
  let removeCheckerCoords: number[] | null = null;
  let removeCheckerKey: string | null = null;

  // if this move was a hop, remove the correct player piece
  console.log("Move" + move);

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

  console.log("Remove coords: " + removeCheckerCoords);
  console.log("Players: " + JSON.stringify(player));

  // update the left/right hop coordinates for this piece
  const leftHopCoords: number[] = getLeftHopForCPU(game, final);
  const rightHopCoords: number[] = getRightHopForCPU(game, final);

  const updatedComputer = {
    ...computer,
    [id]: {
      coords: final,
      leftHopCoords: leftHopCoords,
      rightHopCoords: rightHopCoords,
      lastMove: move,
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

  // since computer pieces changed, update all affected player pieces
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

function updateComputerHops(newGame: GameState): ComputerPieces {
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

const getLeftHopForCPU = (game: GameState, coords: number[]): number[] => {
  const leftHopCoords = [coords[0] - 2, coords[1] + 2];
  const player = game.playerCheckers;

  if (
    isValidBounds(leftHopCoords) === false ||
    isEmptySquare(game, leftHopCoords) === false
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

const getRightHopForCPU = (game: GameState, coords: number[]): number[] => {
  const rightHopCoords = [coords[0] + 2, coords[1] + 2];
  const player = game.playerCheckers;

  if (
    isValidBounds(rightHopCoords) === false ||
    isEmptySquare(game, rightHopCoords) === false
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

const isEmptySquare = (game: GameState, coord: number[]) => {
  return checkIfEmpty(game, coord);
};
