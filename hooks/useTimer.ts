import { clear } from "console";
import { useCallback, useEffect, useState } from "react";

const useTimer = (time: number) => {
  const [timer, setTimer] = useState<number>(time);
  const [status, setStatus] = useState<"started" | "ended" | "resetted">();
  const [timeIsUp, setTimeIsUp] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<any>("");

  useEffect(() => {
    console.log(timer);
    if (timer === 0) {
      clearInterval(intervalId);
      setTimeIsUp(true);
    }
  }, [timer]);

  const startTimer = () => {
    let interval = setInterval(() => {
      setTimer((prevState) => prevState - 1);
    }, 1000);
    setIntervalId(interval);
  };

  const resetTimer = () => {
    setTimeIsUp(false);
    clearInterval(intervalId);
    setTimer(time);
  };

  return { timer, startTimer, resetTimer, timeIsUp, timerStatus: status };
};

export default useTimer;
