import { useState } from "react";
import Board from "./components/Board";
import { DropItemProps } from "./components/BoardSquare";

const playerCheckers: { [id: string]: number[] } = {
  "1": [0, 7],
  "2": [2, 7],
  "3": [4, 7],
  "4": [6, 7],
  "5": [1, 6],
  "6": [3, 6],
  "7": [5, 6],
  "8": [7, 6],
  "9": [0, 5],
  "10": [2, 5],
  "11": [4, 5],
  "12": [6, 5],
};

const computerCheckers: { [id: string]: number[] } = {
  "1": [0, 0],
  "2": [2, 0],
  "3": [4, 0],
  "4": [6, 0],
  "5": [1, 1],
  "6": [3, 1],
  "7": [5, 1],
  "8": [7, 1],
  "9": [0, 2],
  "10": [2, 2],
  "11": [4, 2],
  "12": [6, 2],
};

function App() {
  const [player, setPlayer] = useState(playerCheckers);
  const [computer, setComputer] = useState(computerCheckers);

  function updatePosition(final: number[], item: DropItemProps) {
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      [item.id]: final,
    }));
  }

  return (
    <div>
      <div style={{ height: "500px", width: "500px" }}>
        <Board
          player={player}
          updatePosition={updatePosition}
          computer={computer}
        />
      </div>
    </div>
  );
}

export default App;
