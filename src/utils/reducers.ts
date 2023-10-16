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
import { GameCheckers, GameState, Move, initialGameState } from "./constants";
import { getComputerMoveType, getPlayerMoveType } from "./helpers";

type GameAction = {
  type: "cpuMove" | "playerMove" | "resetGame" | "undo" | "redo";
  coords?: number[];
  id?: string;
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "cpuMove":
      if (action.coords && action.id) {
        const newCpuMove: GameCheckers = moveCpu(
          state.present,
          action.coords,
          action.id
        );
        return {
          past: [state.present, ...state.past],
          present: newCpuMove,
          future: [],
        };
      } else {
        return state;
      }
    case "playerMove":
      if (action.coords && action.id) {
        const newPlayerMove: GameCheckers = movePlayer(
          state.present,
          action.coords,
          action.id
        );
        return {
          past: [state.present, ...state.past],
          present: newPlayerMove,
          future: [],
        };
      } else {
        return state;
      }
    case "redo":
      return redoMove(state);
    case "undo":
      return undoMove(state);
    case "resetGame":
      return resetGame();
    default:
      return state;
  }
}

function redoMove(state: GameState): GameState {
  if (state.future.length > 0) {
    const [newPresent, ...newFuture] = state.future;
    return {
      past: [state.present, ...state.past],
      present: newPresent,
      future: newFuture,
    };
  } else {
    return state;
  }
}

function undoMove(state: GameState): GameState {
  if (state.past.length > 0) {
    const [newPresent, ...newPast] = state.past;
    return {
      past: newPast,
      present: newPresent,
      future: [state.present, ...state.future],
    };
  } else {
    return state;
  }
}

function resetGame(): GameState {
  localStorage.clear();
  return initialGameState;
}
function movePlayer(
  game: GameCheckers,
  final: number[],
  id: string
): GameCheckers {
  let newGame: GameCheckers;
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

function moveCpu(
  game: GameCheckers,
  final: number[],
  id: string
): GameCheckers {
  let newGame: GameCheckers;
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

  // since computer checkers changed, update all affected player checkers
  newGame.playerCheckers = updatePlayerHops(newGame);

  return newGame;
}
