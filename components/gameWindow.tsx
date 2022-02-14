import React, { FC, useEffect, useState } from "react";
import styles from "./game_window.module.css";
import { IoMdClose } from "react-icons/io";
import { HiDesktopComputer } from "react-icons/hi";
import { BsFillPersonFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { resetSettings } from "../Redux";
import useRecognition from "../hooks/useRecognition";
import useSpeaker from "../hooks/useSpeaker";
import grammar from "../public/names.json";
import { generateNumber } from "../utils/generateNumber";
import { GameSettings, Player } from "../types";
import PlayerWrapper from "./playerWrapper";
import { getLastCharOfWord } from "../utils/getLastCharOFWord";
import useTimer from "../hooks/useTimer";
import useWordList from "../hooks/useWordList";
import Results from "./result";
import MicrophoneWrapper from "./microphoneWrapper";
import useGame from "../hooks/useGame";

type GameWindowProps = {
  gameSettings: GameSettings;
};

const GameWindow: FC<GameWindowProps> = ({ gameSettings }) => {
  const {
    machineAnswer,
    humanAnswer,
    wordList,
    recognitionStatus,
    started,
    player,
    finished,
    gameHandlers,
    winner,
    timer,
    losingReason,
  } = useGame(gameSettings);

  // const dispatch = useDispatch();

  // const { speak, speaker } = useSpeaker();

  // const { recognition, recognitionResult, recognitionStatus } = useRecognition(
  //   (result) => {
  //     let checkResult = checkAnswer(result);
  //     setHumanAnswer(result);
  //   }
  // );

  // const { startTimer, resetTimer, timeIsUp, timer } = useTimer(8);

  // const { addList, resetList, state: wordList } = useWordList();

  // useEffect(() => {
  //   if (timeIsUp) {
  //     handleFinish(player === "human" ? "machine" : "human");
  //   }
  // }, [timeIsUp]);

  // const [humanAnswer, setHumanAnswer] = useState<string>("");
  // const [machineAnswer, setMachineAnswer] = useState<string>("");
  // const [player, setPlayer] = useState<Player>("machine");
  // const [winner, setWinner] = useState<"" | Player>("");
  // const [finished, setFinished] = useState<boolean>(false);
  // const [started, setStarted] = useState<boolean>(false);

  // const handleCancel = () => {
  //   recognition?.stop();
  //   speaker?.pause();
  //   speaker?.cancel();
  //   resetTimer();
  //   dispatch(resetSettings());
  // };

  // const handleFinish = (winner: Player) => {
  //   resetTimer();
  //   recognition?.stop();
  //   speaker?.pause();
  //   speaker?.cancel();
  //   setWinner((prevState) => winner);
  //   setStarted(false);
  //   setFinished(true);
  // };

  // // To Change turn

  // useEffect(() => {
  //   if (humanAnswer) {
  //     addList(humanAnswer);
  //     if (checkAnswer(humanAnswer) !== "valid") {
  //       handleFinish("machine");
  //     }
  //     !winner && play("machine");
  //   }
  // }, [humanAnswer]);

  // useEffect(() => {
  //   if (machineAnswer) {
  //     addList(machineAnswer);
  //     !winner && play("human");
  //   }
  // }, [machineAnswer]);

  // const play = (player: Player) => {
  //   resetTimer();
  //   if (player === "human") {
  //     play_human();
  //   } else if (player === "machine") {
  //     play_machine();
  //   }
  // };

  // const play_machine = () => {
  //   // Make sure the recogniton stopped
  //   setPlayer("machine");
  //   recognition?.stop();
  //   let answer = "";
  //   if (!machineAnswer) {
  //     let randomIndex = generateNumber(0, grammar.length - 1);
  //     answer = grammar[randomIndex];
  //   } else {
  //     startTimer();
  //     let willPcWin = Math.random() <= gameSettings.difficulty;
  //     if (willPcWin) {
  //       let lastChar = getLastCharOfWord(humanAnswer);
  //       let filteredResults = grammar.filter(
  //         (word) => word.charAt(0) === lastChar
  //       );
  //       let randomIndex = generateNumber(0, filteredResults.length - 1);
  //       answer = filteredResults[randomIndex];
  //     } // just wait to time up thus pc will lose
  //   }
  //   let randomTimeToAnswer = generateNumber(1, 7);
  //   setTimeout(() => {
  //     // Check if the game restarted
  //     if (!speaker?.paused && (started || !machineAnswer)) {
  //       setMachineAnswer(answer);
  //       speak(answer);
  //     }
  //   }, randomTimeToAnswer * 1000);
  // };

  // const checkAnswer: (
  //   word: string
  // ) => "valid" | "not_includes" | "duplicate" | "incorrect" = (word) => {
  //   if (getLastCharOfWord(machineAnswer) !== word.charAt(0)) {
  //     return "incorrect";
  //   } else if (wordList.includes(word)) {
  //     return "duplicate";
  //   } else if (!grammar.includes(word)) {
  //     return "not_includes";
  //   } else {
  //     return "valid";
  //   }
  // };

  // const waitForMachineSpeaking = () =>
  //   new Promise((resolve, reject) => {
  //     setInterval(() => {
  //       if (!speaker?.speaking) {
  //         resolve(true);
  //       }
  //     }, 500);
  //   });

  // const play_human = async () => {
  //   setPlayer("human");
  //   waitForMachineSpeaking().then(() => {
  //     startTimer();
  //     recognition?.start();
  //   });
  // };

  // const handleStart = () => {
  //   if (!started) {
  //     setStarted(true);
  //     greetings().then(() => {
  //       play_machine();
  //     });
  //   } else {
  //     handleRestart();
  //     setStarted(false);
  //   }
  // };

  // const handleRestart = () => {
  //   resetTimer();
  //   recognition?.stop();
  //   speaker?.pause();
  //   speaker?.cancel();
  //   setHumanAnswer("");
  //   setMachineAnswer("");
  //   setFinished(false);
  //   setStarted(false);
  //   setWinner("");
  //   resetList();
  // };

  return (
    <div className={styles.backgorund_blur}>
      <div className={styles.game_window}>
        {
          <Results
            className={finished ? " top-0" : ""}
            wordList={wordList}
            winner={{
              player_type: winner as Player,
              player_name:
                gameSettings[winner === "human" ? "humanName" : "machineName"],
            }}
            onRestart={gameHandlers.handleRestart}
            losingReason={losingReason}
          />
        }
        <div className={styles.cancel_game} onClick={() => {}}>
          <IoMdClose onClick={gameHandlers.handleCancel} />
        </div>
        <MicrophoneWrapper
          started={started}
          handleStart={gameHandlers.handleStart}
          recognitionStatus={recognitionStatus}
        />

        <div className={styles.game_screen}>
          <PlayerWrapper
            icon={HiDesktopComputer}
            name={gameSettings.machineName}
            answer={machineAnswer}
          />
          <PlayerWrapper
            icon={BsFillPersonFill}
            name={gameSettings.humanName}
            answer={humanAnswer}
          />
        </div>
        <div className={styles.stopwatch}>
          <div className={styles.stopwatch_pc}>
            <div
              className={styles.remain}
              style={{
                width: player === "machine" ? (timer * 100) / 8 + "%" : "100%",
              }}
            ></div>
          </div>
          <div className={styles.stopwatch_human}>
            <div
              className={styles.remain}
              style={{
                width: player === "human" ? (timer * 100) / 8 + "%" : "100%",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameWindow;
