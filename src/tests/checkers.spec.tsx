import { vi } from "vitest";
import { cleanup, render, screen, RenderResult } from "@testing-library/react";
import { wrapWithBackend } from "react-dnd-test-utils";

import Board from "../components/Board";
import {
  CpuType,
  PlayerType,
  computerCheckers,
  playerCheckers,
} from "../utils/constants";

const TestBoard = wrapWithBackend(Board);

function renderTestBoard(
  player: PlayerType,
  computer: CpuType,
  moveChecker: () => void,
  canMoveChecker: () => boolean,
  onHoverChange: () => void,
  hoverElement: string | null
): RenderResult {
  return render(
    <TestBoard
      player={player}
      computer={computer}
      moveChecker={moveChecker}
      canMoveChecker={canMoveChecker}
      onHoverChange={onHoverChange}
      hoverElement={hoverElement}
    />
  );
}

describe("Checkers Game", () => {
  let player: PlayerType;
  let computer: CpuType;

  beforeEach(() => {
    player = playerCheckers;
    computer = computerCheckers;

    renderTestBoard(player, computer, vi.fn(), vi.fn(), vi.fn(), null);
  });

  afterEach(cleanup);

  describe("initial state", () => {
    it("renders checkers appropriately", () => {
      const CpuChecker = screen.getAllByTestId("cpu-checker")[0];

      const display = window
        .getComputedStyle(CpuChecker)
        .getPropertyValue("display");

      expect({ display: display }).toStrictEqual({ display: "block" });
    });
  });
});
