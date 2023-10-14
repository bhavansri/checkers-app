import { useEffect, useReducer, useState } from "react";
import Board from "./components/Board";
import { defaultGame } from "./utils/constants";
import { timeout } from "./utils/helpers";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { gameReducer } from "./utils/reducers";
import { canMoveChecker } from "./utils/playerServices";
import {
  fetchRandomCpuChecker,
  generateCpuDestination,
} from "./utils/cpuServices";

function App() {
  const [game, dispatch] = useReducer(gameReducer, defaultGame);
  const [cpuTurn, setCpuTurn] = useState(false);

  const moveChecker = (final: number[], id: string) => {
    if (!cpuTurn) {
      dispatch({ type: "playerMove", coords: final, id: id });
      setCpuTurn(true);
    }
  };

  const handleCanMove = (final: number[], id: string): boolean => {
    if (!cpuTurn) {
      return canMoveChecker(game, final, id);
    } else {
      return false;
    }
  };

  useEffect(() => {
    async function randomize() {
      if (cpuTurn) {
        await timeout(1500);
        let movedPiece = false;

        while (movedPiece == false) {
          const cpuID: string = fetchRandomCpuChecker(game);
          const destination: number[] = generateCpuDestination(game, cpuID);

          if (destination.length > 0) {
            dispatch({
              type: "cpuMove",
              coords: destination,
              id: cpuID,
            });
            movedPiece = true;
          }
        }
        setCpuTurn(false);
      }
    }

    randomize();
  }, [game, cpuTurn]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div style={{ height: "500px", width: "500px" }}>
          <Board
            game={game}
            moveChecker={moveChecker}
            canMoveChecker={handleCanMove}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
