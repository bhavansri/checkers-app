export const ItemTypes = {
  CHECKER: "checker",
};

export enum Move {
  none = "NONE",
  left = "LEFT",
  right = "RIGHT",
  hopLeft = "HOP_LEFT",
  hopRight = "HOP_RIGHT",
}

export type PlayerCheckerProps = {
  coords: number[];
  leftHopCoords: number[];
  rightHopCoords: number[];
  lastMove: Move;
};

export type CpuCheckerProps = {
  coords: number[];
  lastMove: Move;
};

export type CpuMovePossibility = {
  dest: number[];
  move: Move;
};

export const playerCheckers: { [id: string]: PlayerCheckerProps } = {
  "1": {
    coords: [0, 7],
    leftHopCoords: [],
    rightHopCoords: [],
    lastMove: Move.none,
  },
  "2": {
    coords: [2, 7],
    leftHopCoords: [],
    rightHopCoords: [],
    lastMove: Move.none,
  },
  "3": {
    coords: [4, 7],
    leftHopCoords: [],
    rightHopCoords: [],
    lastMove: Move.none,
  },
  "4": {
    coords: [6, 7],
    leftHopCoords: [],
    rightHopCoords: [],
    lastMove: Move.none,
  },
  "5": {
    coords: [1, 6],
    leftHopCoords: [],
    rightHopCoords: [],
    lastMove: Move.none,
  },
  "6": {
    coords: [3, 6],
    leftHopCoords: [],
    rightHopCoords: [],
    lastMove: Move.none,
  },
  "7": {
    coords: [5, 6],
    leftHopCoords: [],
    rightHopCoords: [],
    lastMove: Move.none,
  },
  "8": {
    coords: [7, 6],
    leftHopCoords: [],
    rightHopCoords: [],
    lastMove: Move.none,
  },
  "9": {
    coords: [0, 5],
    leftHopCoords: [],
    rightHopCoords: [],
    lastMove: Move.none,
  },
  "10": {
    coords: [2, 5],
    leftHopCoords: [],
    rightHopCoords: [],
    lastMove: Move.none,
  },
  "11": {
    coords: [4, 5],
    leftHopCoords: [],
    rightHopCoords: [],
    lastMove: Move.none,
  },
  "12": {
    coords: [6, 5],
    leftHopCoords: [],
    rightHopCoords: [],
    lastMove: Move.none,
  },
};

export const computerCheckers: { [id: string]: CpuCheckerProps } = {
  "1": { coords: [1, 0], lastMove: Move.none },
  "2": { coords: [3, 0], lastMove: Move.none },
  "3": { coords: [5, 0], lastMove: Move.none },
  "4": { coords: [7, 0], lastMove: Move.none },
  "5": { coords: [0, 1], lastMove: Move.none },
  "6": { coords: [2, 1], lastMove: Move.none },
  "7": { coords: [4, 1], lastMove: Move.none },
  "8": { coords: [6, 1], lastMove: Move.none },
  "9": { coords: [1, 2], lastMove: Move.none },
  "10": { coords: [3, 2], lastMove: Move.none },
  "11": { coords: [5, 2], lastMove: Move.none },
  "12": { coords: [7, 2], lastMove: Move.none },
};
