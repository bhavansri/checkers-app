import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/Constants";
import { useEffect } from "react";

type CheckerPieceProps = {
  dark: boolean;
  id: string;
};

const CheckerPiece = ({ dark, id }: CheckerPieceProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHECKER,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const bgColor = dark ? "bg-black" : "bg-stone-400";
  const opacity = isDragging ? "opacity-50" : "opacity-100";

  useEffect(() => {
    console.log("is dragging: " + isDragging);
  }, [isDragging]);

  return (
    <div
      ref={drag}
      className={`w-14 h-14 rounded-full ${bgColor} ${opacity} cursor-move`}
      style={{ transform: "translate(0, 0)" }}
    ></div>
  );
};

export default CheckerPiece;
