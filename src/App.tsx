import { defaultGame } from "./utils/constants";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Game from "./components/Game";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Game gameState={defaultGame} />
    </DndProvider>
  );
}

export default App;
