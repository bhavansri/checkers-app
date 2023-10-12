import { useEffect, useState } from "react";
import Board from "./components/Board";

const playerCheckers = [
  [0, 7],
  [1, 6],
  [2, 7],
  [3, 6],
  [4, 7],
  [5, 6],
  [6, 7],
  [7, 6],
];
function App() {
  const [playerPositions, setPlayerPositions] = useState<number[]>([0, 0]);

  function updatePosition(pos: number[]) {
    const newPosition = [pos[0], pos[1]];
    setPlayerPositions(newPosition);
  }

  return (
    <div>
      <div style={{ height: "500px", width: "500px" }}>
        <Board
          playerPositions={playerPositions}
          updatePosition={updatePosition}
        />
      </div>
    </div>
  );
}

export default App;
