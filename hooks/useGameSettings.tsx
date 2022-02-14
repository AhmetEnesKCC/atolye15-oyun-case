import { LegacyRef, useEffect, useRef, useState } from "react";
import { GameSettings } from "../types";

const useGameSettings = () => {
  const humanNameRef = useRef<HTMLInputElement | null>(null);
  const pcNameRef = useRef<HTMLInputElement | null>(null);
  const difficultyRef = useRef<
    HTMLDivElement | HTMLSelectElement | LegacyRef<HTMLDivElement> | null
  >(null);

  const [settings, setSettings] = useState<GameSettings | {}>({});

  const [start, setStart] = useState<boolean>(false);

  useEffect(() => {
    if (start) {
      setSettings({
        difficulty: (difficultyRef.current as HTMLDivElement)!.querySelector(
          "select"
        )?.value,
        names: {
          human: humanNameRef.current?.value,
          pc: pcNameRef.current?.value,
        },
      });
    }
  }, [start]);

  return {
    refs: {
      humanNameRef,
      pcNameRef,
      difficultyRef,
    },
    settings,
    start,
    setStart,
  };
};

export default useGameSettings;
