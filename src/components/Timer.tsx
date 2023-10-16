import { useCallback, useEffect, useState } from "react";

type TimerProps = {
  startTime: string;
};

const Timer = ({ startTime }: TimerProps) => {
  const [parsedTime, setParsedTime] = useState("");

  const getTime = useCallback(() => {
    const endTime = new Date();
    const startTimestamp = new Date(startTime).getTime();
    const seconds: number = Math.floor(
      ((endTime.getTime() - startTimestamp) / 1000) % 60
    );
    const minutes: number = Math.floor(
      (endTime.getTime() - startTimestamp) / 1000 / 60
    );

    setParsedTime(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
  }, [startTime]);

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);

    return () => clearInterval(interval);
  }, [getTime]);

  return (
    <div className="uppercase font-semibold text-3xl">{`${parsedTime}`}</div>
  );
};

export default Timer;
