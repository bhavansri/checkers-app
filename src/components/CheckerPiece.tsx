import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/Constants";

type CheckerPieceProps = {
  dark: boolean;
};

const CheckerPiece = ({ dark }: CheckerPieceProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHECKER,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const bgColor = dark ? "bg-black" : "bg-stone-400";
  const opacity = isDragging ? "opacity-50" : "opacity-100";

  return (
    <div
      ref={drag}
      className={`w-14 h-14 rounded-full ${bgColor} ${opacity} cursor-move`}
      style={{ transform: "translate(0, 0)" }}
    ></div>
  );
};

export default CheckerPiece;
