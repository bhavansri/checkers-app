import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/Constants";

type PieceProps = {
  id: string;
};

const PlayerPiece = ({ id }: PieceProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHECKER,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const opacity = isDragging ? "opacity-50" : "opacity-100";

  return (
    <div
      ref={drag}
      className={`w-14 h-14 rounded-full bg-black ${opacity} cursor-move`}
      style={{ transform: "translate(0, 0)" }}
    ></div>
  );
};

const CpuPiece = ({ id }: PieceProps) => {
  return (
    <div
      className={`w-14 h-14 rounded-full bg-stone-400`}
      style={{ transform: "translate(0, 0)" }}
    ></div>
  );
};

export { PlayerPiece, CpuPiece };
