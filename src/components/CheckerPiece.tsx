import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/constants";

type PieceProps = {
  id: string;
  onHoverChange: (isHovering: boolean, itemId: string) => void;
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
      className={`w-14 h-14 rounded-full bg-black ${opacity} cursor-move translate-x-0 translate-y-0`}
      data-testid="player-checker"
    ></div>
  );
};

const CpuPiece = () => {
  return (
    <div
      className={`w-14 h-14 rounded-full bg-red-600 translate-x-0 translate-y-0`}
      data-testid="cpu-checker"
    ></div>
  );
};

export { PlayerPiece, CpuPiece };
