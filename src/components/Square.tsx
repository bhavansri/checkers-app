type SquareProps = {
  dark: boolean;
  children: JSX.Element | null;
};

const Square = ({ dark, children }: SquareProps) => {
  const bgColor = dark ? "bg-neutral-700" : "bg-neutral-300";

  return (
    <div
      className={`${bgColor} h-full w-full flex items-center justify-center`}
    >
      {children}
    </div>
  );
};

export default Square;
