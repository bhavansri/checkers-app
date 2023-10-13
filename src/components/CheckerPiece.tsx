import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/Constants";
import { useRef, useState } from "react";

type PieceProps = {
  id: string;
};

const PlayerPiece = ({ id }: PieceProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHECKER,
    item: { id },
    isDragging: (monitor) => id === monitor.getItem().id || hover.current,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const hover = useRef(false);
  const opacity = isDragging ? "opacity-50" : "opacity-100";

  const onHover = (isHovering: boolean) => {
    hover.current = isHovering;
    console.log("hover changed: " + hover.current);
  };

  return (
    <div
      ref={drag}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`w-14 h-14 rounded-full bg-black ${opacity} cursor-move`}
      style={{ transform: "translate(0, 0)" }}
    >
      <p className="text-white text-xl">{id}</p>
    </div>
  );
};

const CpuPiece = ({ id }: PieceProps) => {
  return (
    <div
      className={`w-14 h-14 rounded-full bg-stone-400`}
      style={{ transform: "translate(0, 0)" }}
    >
      <p className="text-blue text-xl">{id}</p>
    </div>
  );
};

export { PlayerPiece, CpuPiece };
