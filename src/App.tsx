import Board from "./components/Board";
import { defaultGame } from "./utils/constants";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div style={{ height: "500px", width: "500px" }}>
          <Board initialGame={defaultGame} />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
