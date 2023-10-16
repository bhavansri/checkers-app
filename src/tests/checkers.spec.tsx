import "@testing-library/jest-dom";
import {
  cleanup,
  render,
  screen,
  RenderResult,
  within,
  fireEvent,
} from "@testing-library/react";
import { fireDragDrop, wrapWithBackend } from "react-dnd-test-utils";
import { GameState, Move, initialGameState } from "../utils/constants";
import {
  fetchRandomCpuChecker,
  generateCpuDestination,
} from "../utils/cpuServices";
import Game from "../components/Game";

const TestBoard = wrapWithBackend(Game);

function renderGame(game: GameState): RenderResult {
  return render(<TestBoard gameState={game} />);
}

describe("Checkers App Tests", () => {
  describe("setup initial state", () => {
    let gameState: GameState;
    beforeEach(() => {
      window.localStorage.clear();
      gameState = initialGameState;
      renderGame(gameState);
    });

    afterEach(cleanup);

    it("should render the correct number of checkers", () => {
      const cpuCheckersCount = screen.getAllByTestId("cpu-checker").length;
      const playerCheckersCount =
        screen.getAllByTestId("player-checker").length;

      expect(cpuCheckersCount).toBe(12);
      expect(playerCheckersCount).toBe(12);
    });

    it("should render the correct number of squares", () => {
      const cpuCheckersCount = screen.getAllByRole("Square");
      expect(cpuCheckersCount.length).toBe(64);
    });

    it("should render cpu checkers in correct squares", () => {
      expect(
        within(screen.getByTestId("(1,0)")).getByTestId("cpu-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(3,0)")).getByTestId("cpu-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(5,0)")).getByTestId("cpu-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(7,0)")).getByTestId("cpu-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(0,1)")).getByTestId("cpu-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(2,1)")).getByTestId("cpu-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(4,1)")).getByTestId("cpu-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(6,1)")).getByTestId("cpu-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(1,2)")).getByTestId("cpu-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(3,2)")).getByTestId("cpu-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(5,2)")).getByTestId("cpu-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(7,2)")).getByTestId("cpu-checker")
      ).not.toBeNull();
    });

    it("should render player checkers in correct squares", () => {
      expect(
        within(screen.getByTestId("(0,5)")).getByTestId("player-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(2,5)")).getByTestId("player-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(4,5)")).getByTestId("player-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(6,5)")).getByTestId("player-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(1,6)")).getByTestId("player-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(3,6)")).getByTestId("player-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(5,6)")).getByTestId("player-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(7,6)")).getByTestId("player-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(0,7)")).getByTestId("player-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(2,7)")).getByTestId("player-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(4,7)")).getByTestId("player-checker")
      ).not.toBeNull();

      expect(
        within(screen.getByTestId("(6,7)")).getByTestId("player-checker")
      ).not.toBeNull();
    });
  });

  describe("Generate a valid random cpu checker", () => {
    let gameState: GameState;

    beforeEach(() => {
      window.localStorage.clear();
      gameState = initialGameState;
    });

    afterEach(cleanup);

    it("should generate a random key from remaining game state", () => {
      const checkerKey = fetchRandomCpuChecker(gameState.present);

      expect(parseInt(checkerKey)).toBeLessThan(13);
      expect(parseInt(checkerKey)).toBeGreaterThan(0);
    });

    it("should return cpu key with a hoppable player checker", () => {
      const gameState: GameState = {
        past: [],
        present: {
          playerCheckers: {},
          computerCheckers: {
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
              leftHopCoords: [2, 5],
              rightHopCoords: [],
              lastMove: Move.none,
            },
          },
          playerMoveCount: 0,
          cpuMoveCount: 0,
        },
        future: [],
      };

      const checkerKey = fetchRandomCpuChecker(gameState.present);
      expect(parseInt(checkerKey)).toEqual(3);
    });
  });

  describe("Test cpu randomizing move functions", () => {
    let gameState: GameState;

    beforeEach(() => {
      window.localStorage.clear();
      gameState = initialGameState;
    });

    afterEach(cleanup);

    it("should move (5,2) cpu checker by 1-square to either (4,3) or (6,3)", () => {
      const randomizedDestination = generateCpuDestination(
        gameState.present,
        "11"
      );
      const initialCoords = gameState.present.computerCheckers["11"].coords;
      expect(Math.abs(randomizedDestination[0] - initialCoords[0])).toEqual(1);
      expect(Math.abs(randomizedDestination[1] - initialCoords[1])).toEqual(1);
    });

    it("should perform hop if player checker exists in-between", () => {
      const hopComputerState: GameState = {
        past: [],
        present: {
          playerCheckers: {
            "1": {
              coords: [6, 3],
              leftHopCoords: [],
              rightHopCoords: [],
              lastMove: Move.right,
            },
          },
          computerCheckers: {
            "1": {
              coords: [7, 2],
              leftHopCoords: [5, 4],
              rightHopCoords: [],
              lastMove: Move.none,
            },
          },
          cpuMoveCount: 0,
          playerMoveCount: 0,
        },
        future: [],
      };
      const hopDestination = generateCpuDestination(
        hopComputerState.present,
        "1"
      );
      expect(hopDestination.toString()).toEqual([5, 4].toString());
    });
  });

  describe("move player checker by 1-square", () => {
    let gameState: GameState;
    beforeEach(() => {
      window.localStorage.clear();
      gameState = initialGameState;
      renderGame(gameState);
    });

    afterEach(cleanup);

    it("should move (2,5) player checker to (1,4)", async () => {
      const checker = within(screen.getByTestId("(2,5)")).getByTestId(
        "player-checker"
      );
      const targetSquare = screen.getByTestId("(1,4)");
      await fireDragDrop(checker, targetSquare);

      expect(within(targetSquare).getByTestId("player-checker")).not.toBeNull();
    });

    it("should move (2,5) checker to (3,4)", async () => {
      const checker = within(screen.getByTestId("(2,5)")).getByTestId(
        "player-checker"
      );
      const targetSquare = screen.getByTestId("(3,4)");
      await fireDragDrop(checker, targetSquare);

      expect(within(targetSquare).getByTestId("player-checker")).not.toBeNull();
    });

    it("should not allow (2,5) checker to perform an illegal move", async () => {
      const checker = within(screen.getByTestId("(2,5)")).getByTestId(
        "player-checker"
      );
      const targetSquare = screen.getByTestId("(4,4)");
      await fireDragDrop(checker, targetSquare);

      expect(within(targetSquare).queryByTestId("player-checker")).toBeNull();
    });
  });

  describe("hop player over right enemy checker", () => {
    let hopPlayerState: GameState;

    beforeEach(() => {
      window.localStorage.clear();
      hopPlayerState = {
        past: [],
        present: {
          playerCheckers: {
            "1": {
              coords: [5, 4],
              leftHopCoords: [7, 2],
              rightHopCoords: [],
              lastMove: Move.none,
            },
          },
          computerCheckers: {
            "1": {
              coords: [6, 3],
              leftHopCoords: [],
              rightHopCoords: [],
              lastMove: Move.none,
            },
          },
          playerMoveCount: 0,
          cpuMoveCount: 0,
        },
        future: [],
      };

      renderGame(hopPlayerState);
    });

    afterEach(cleanup);

    it("should hop (5,4) player piece over (6,3) cpu piece and remove it", async () => {
      const checker = within(screen.getByTestId("(5,4)")).getByTestId(
        "player-checker"
      );

      const targetSquare = screen.getByTestId("(7,2)");
      within(screen.getByTestId("(6,3)")).findByTestId("cpu-checker");

      await fireDragDrop(checker, targetSquare);

      expect(within(targetSquare).getByTestId("player-checker")).not.toBeNull();
      expect(screen.queryByTestId("cpu-checker")).not.toBeInTheDocument();
    });
  });

  describe("hop player over left enemy checker", () => {
    let hopPlayerState: GameState;

    beforeEach(() => {
      window.localStorage.clear();
      hopPlayerState = {
        past: [],
        present: {
          playerCheckers: {
            "1": {
              coords: [5, 4],
              leftHopCoords: [],
              rightHopCoords: [3, 2],
              lastMove: Move.none,
            },
          },
          computerCheckers: {
            "1": {
              coords: [4, 3],
              leftHopCoords: [],
              rightHopCoords: [],
              lastMove: Move.none,
            },
          },
          playerMoveCount: 0,
          cpuMoveCount: 0,
        },
        future: [],
      };

      renderGame(hopPlayerState);
    });

    afterEach(cleanup);

    it("should hop (5,4) player piece over (4,3) cpu piece and remove it", async () => {
      const checker = within(screen.getByTestId("(5,4)")).getByTestId(
        "player-checker"
      );

      const targetSquare = screen.getByTestId("(3,2)");
      within(screen.getByTestId("(4,3)")).findByTestId("cpu-checker");

      await fireDragDrop(checker, targetSquare);

      expect(within(targetSquare).getByTestId("player-checker")).not.toBeNull();
      expect(screen.queryByTestId("cpu-checker")).not.toBeInTheDocument();
    });
  });

  describe("Undo and redo actions", () => {
    let gameState: GameState;
    beforeEach(() => {
      window.localStorage.clear();
      gameState = initialGameState;
      renderGame(gameState);
    });

    afterEach(cleanup);

    it("should restore state after performing a move, when pressing redo", async () => {
      const checker = within(screen.getByTestId("(2,5)")).getByTestId(
        "player-checker"
      );
      const initialSquare = screen.getByTestId("(2,5)");
      const targetSquare = screen.getByTestId("(1,4)");
      await fireDragDrop(checker, targetSquare);
      const undoButton = screen.getByTestId("undo-button");
      fireEvent.click(undoButton);

      expect(
        within(targetSquare).queryByTestId("player-checker")
      ).not.toBeInTheDocument();
      expect(
        within(initialSquare).getByTestId("player-checker")
      ).not.toBeNull();
    });

    it("should restore state after performing an undo action, when pressing redo", async () => {
      const checker = within(screen.getByTestId("(2,5)")).getByTestId(
        "player-checker"
      );

      const targetSquare = screen.getByTestId("(1,4)");
      await fireDragDrop(checker, targetSquare);
      const undoButton = screen.getByTestId("undo-button");
      fireEvent.click(undoButton);
      const redoButton = screen.getByTestId("redo-button");
      fireEvent.click(redoButton);

      expect(within(targetSquare).getByTestId("player-checker")).not.toBeNull();
    });
  });

  describe("Displays correct scores", () => {
    let progressedGameState: GameState;

    beforeEach(() => {
      window.localStorage.clear();
      progressedGameState = {
        past: [],
        present: {
          playerCheckers: {
            "1": {
              coords: [5, 4],
              leftHopCoords: [7, 2],
              rightHopCoords: [],
              lastMove: Move.none,
            },
          },
          computerCheckers: {
            "1": {
              coords: [6, 3],
              leftHopCoords: [],
              rightHopCoords: [],
              lastMove: Move.none,
            },
            "2": {
              coords: [4, 3],
              leftHopCoords: [],
              rightHopCoords: [],
              lastMove: Move.none,
            },
          },
          playerMoveCount: 0,
          cpuMoveCount: 0,
        },
        future: [],
      };

      renderGame(progressedGameState);
    });

    afterEach(cleanup);

    it("should display the computer with a leading score", () => {
      const computerScore = screen.getByTestId("cpu-score");
      const playerScore = screen.getByTestId("player-score");

      expect(computerScore).toHaveTextContent("11");
      expect(playerScore).toHaveTextContent("10");
    });
  });

  describe("display correct # of player moves", () => {
    let gameState: GameState;
    beforeEach(() => {
      window.localStorage.clear();
      gameState = initialGameState;
      renderGame(gameState);
    });

    afterEach(cleanup);

    it("should display a count of 1 for player after single move", async () => {
      const checker = within(screen.getByTestId("(2,5)")).getByTestId(
        "player-checker"
      );
      const targetSquare = screen.getByTestId("(1,4)");

      await fireDragDrop(checker, targetSquare);

      expect(screen.getByTestId("player-move-count")).toHaveTextContent(
        "# of player moves: 1"
      );
    });
  });
});
