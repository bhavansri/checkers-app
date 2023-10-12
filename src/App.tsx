import { useState } from "react";
import Board from "./components/Board";
import { DropItemProps } from "./components/BoardSquare";

const playerCheckers: { [id: string]: number[] } = {
  "1": [0, 7],
  "2": [1, 6],
  "3": [2, 7],
  "4": [3, 6],
  "5": [4, 7],
  "6": [5, 6],
  "7": [6, 7],
  "8": [7, 6],
};

function App() {
  const [playerPositions, setPlayerPositions] = useState(playerCheckers);

  function updatePosition(position: number[], item: DropItemProps) {
    setPlayerPositions((prevPositions) => ({
      ...prevPositions,
      [item.id]: position,
    }));
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
