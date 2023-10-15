import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/constants";

type PieceProps = {
  id: string;
  onHoverChange: (isHovering: boolean, itemId: string) => void;
};

type CpuProps = {
  id: string;
};

const PlayerPiece = ({ id, onHoverChange }: PieceProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHECKER,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const opacity = isDragging ? "opacity-50" : "opacity-100";

  const onHover = (isHovering: boolean) => {
    onHoverChange(isHovering, id);
  };

  return (
    <div
      ref={drag}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`w-14 h-14 rounded-full bg-black ${opacity} cursor-move`}
      style={{ transform: "translate(0, 0)" }}
      data-testid="player-checker"
    >
      <p className="text text-white">{id}</p>
    </div>
  );
};

const CpuPiece = ({ id }: CpuProps) => {
  return (
    <div
      className={`w-14 h-14 rounded-full bg-stone-400`}
      style={{ transform: "translate(0, 0)" }}
      data-testid="cpu-checker"
    >
      <p className="text text-white">{id}</p>
    </div>
  );
};

export { PlayerPiece, CpuPiece };
