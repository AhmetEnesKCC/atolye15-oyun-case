import { useEffect, useState } from "react";
import {
  GameHandlers,
  GameSettings,
  LosingReasons,
  Player,
  RecognitionStatus,
} from "../types";
import grammar from "../public/names.json";
import { useDispatch } from "react-redux";
import useSpeaker from "./useSpeaker";
import useRecognition from "./useRecognition";
import useWordList from "./useWordList";
import useTimer from "./useTimer";

import { generateNumber } from "../utils/generateNumber";
import { getLastCharOfWord } from "../utils/getLastCharOFWord";
import { resetSettings } from "../Redux";

type GameHook = (gameSettings: GameSettings) => {
  gameHandlers: GameHandlers;
  recognitionStatus: RecognitionStatus;
  wordList: string[];
  humanAnswer: string;
  machineAnswer: string;
  started: boolean;
  player: Player;
  finished: boolean;
  winner: Player | "";
  timer: number;
  losingReason: LosingReasons;
};

const useGame: GameHook = (gameSettings) => {
  const dispatch = useDispatch();

  const [humanAnswer, setHumanAnswer] = useState<string>("");
  const [machineAnswer, setMachineAnswer] = useState<string>("");
  const [player, setPlayer] = useState<Player>("machine");
  const [winner, setWinner] = useState<"" | Player>("");
  const [finished, setFinished] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [losingReason, setLosingReason] = useState<"" | LosingReasons>("");

  const { speak, speaker } = useSpeaker();

  const { recognition, recognitionStatus } = useRecognition((result) => {
    setHumanAnswer(result);
  });

  const { startTimer, resetTimer, timerStatus, timeIsUp, timer } = useTimer(8);

  const { addList, resetList, state: wordList } = useWordList();

  // plays

  const play = (player: Player) => {
    resetTimer();
    if (player === "human") {
      play_human();
    } else if (player === "machine") {
      play_machine();
    }
  };

  // To wait to machine speaking

  const waitForMachineSpeaking = () =>
    new Promise((resolve) => {
      setInterval(() => {
        if (!speaker?.speaking) {
          resolve(true);
        }
      }, 500);
    });

  const play_human = async () => {
    setPlayer("human");
    waitForMachineSpeaking().then(() => {
      startTimer();
      recognition?.start();
    });
  };

  const play_machine = () => {
    // Make sure the recogniton stopped
    setPlayer("machine");
    recognition?.stop();
    let answer = "";
    if (!machineAnswer) {
      let randomIndex = generateNumber(0, grammar.length - 1);
      answer = grammar[randomIndex];
    } else {
      startTimer();
      let willPcWin = Math.random() <= gameSettings.difficulty;
      if (willPcWin) {
        let lastChar = getLastCharOfWord(humanAnswer);
        let filteredResults = grammar.filter(
          (word) => word.charAt(0) === lastChar
        );
        let randomIndex = generateNumber(0, filteredResults.length - 1);
        answer = filteredResults[randomIndex];
      } // just wait to time up thus pc will lose
    }
    let randomTimeToAnswer = generateNumber(1, 7);
    setTimeout(() => {
      // Check if the game restarted
      if (!speaker?.paused && (started || !machineAnswer)) {
        setMachineAnswer(answer);
        speak(answer);
      }
    }, randomTimeToAnswer * 1000);
  };

  // Helpers

  const checkAnswer: (word: string) => "valid" | LosingReasons = (word) => {
    if (getLastCharOfWord(machineAnswer) !== word.charAt(0)) {
      return "incorrect";
    } else if (wordList.includes(word)) {
      return "duplicate";
    } else if (!grammar.includes(word)) {
      return "not_includes";
    } else {
      return "valid";
    }
  };

  const greetings = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        speak("Başlıyoruz");
        resolve("finished");
      }, 500);
    });
  };

  // Handlers

  const gameHandlers: GameHandlers = {
    handleStart: () => {
      if (!started) {
        setStarted(true);
        greetings().then(() => {
          play_machine();
        });
      } else {
        gameHandlers.handleRestart();
        setStarted(false);
      }
    },

    handleCancel: () => {
      recognition?.stop();
      speaker?.pause();
      speaker?.cancel();
      resetTimer();
      dispatch(resetSettings());
    },

    handleFinish: (winner: Player) => {
      resetTimer();
      recognition?.stop();
      speaker?.pause();
      speaker?.cancel();
      setWinner((prevState) => winner);
      setStarted(false);
      setFinished(true);
    },
    handleRestart: () => {
      resetTimer();
      recognition?.stop();
      speaker?.pause();
      speaker?.cancel();
      setHumanAnswer("");
      setMachineAnswer("");
      setFinished(false);
      setStarted(false);
      setWinner("");
      resetList();
    },
  };

  gameHandlers.handleStart = () => {
    if (!started) {
      setStarted(true);
      greetings().then(() => {
        play_machine();
      });
    } else {
      gameHandlers.handleRestart();
      setStarted(false);
    }
  };

  gameHandlers.handleCancel = () => {
    recognition?.stop();
    speaker?.pause();
    speaker?.cancel();
    resetTimer();
    dispatch(resetSettings());
  };

  gameHandlers.handleFinish = (winner: Player) => {
    resetTimer();
    recognition?.stop();
    speaker?.pause();
    speaker?.cancel();
    setWinner((prevState) => winner);
    setStarted(false);
    setFinished(true);
  };

  // Effects

  useEffect(() => {
    if (humanAnswer) {
      addList(humanAnswer);
      // If answer is not valid finish game
      let checkResult = checkAnswer(humanAnswer);
      if (checkResult !== "valid") {
        gameHandlers.handleFinish("machine");
        setLosingReason(checkResult);
      } else {
        !winner && play("machine");
      }
    }
  }, [humanAnswer]);

  useEffect(() => {
    if (machineAnswer) {
      addList(machineAnswer);
      !winner && play("human");
    }
  }, [machineAnswer]);

  useEffect(() => {
    if (timeIsUp) {
      gameHandlers.handleFinish(player === "human" ? "machine" : "human");
      setLosingReason("time up");
    }
  }, [timeIsUp]);

  return {
    gameHandlers,
    recognitionStatus,
    wordList,
    humanAnswer,
    machineAnswer,
    started,
    player,
    finished,
    winner,
    timer,
    losingReason: losingReason as LosingReasons,
  };
};

export default useGame;
