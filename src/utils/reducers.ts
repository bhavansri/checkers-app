import {
  getLeftHopForCPU,
  getRightHopForCPU,
  updateComputerHops,
} from "./cpuServices";
import {
  getLeftHopForPlayer,
  getRightHopForPlayer,
  updatePlayerHops,
} from "./playerServices";
import { GameState, Move } from "./constants";
import { getComputerMoveType, getPlayerMoveType } from "./helpers";

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
