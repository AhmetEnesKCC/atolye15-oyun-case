import React, { ClassicComponentClass, FC } from "react";
import { LosingReasons, Player, VoidFunctionWithParams } from "../types";
import { getLastCharOfWord } from "../utils/getLastCharOFWord";
import { getWordWithoutLastChar } from "../utils/getWordWithoutLastChar";
import styles from "./result.module.css";
import { HiDesktopComputer } from "react-icons/hi";
import { BsFillPersonFill } from "react-icons/bs";

import { FaArrowRight } from "react-icons/fa";

type ResultProps = {
  winner: {
    player_type: Player;
    player_name: string;
  };
  wordList: string[];
  onRestart: VoidFunctionWithParams;
  className: any;
  losingReason: LosingReasons;
};

const Results: FC<ResultProps> = ({
  winner,
  className,
  wordList,
  losingReason,
  onRestart,
}) => {
  return (
    <div className={`${styles.resultWrapper} ${className}`}>
      <div className={styles.winnerName}>
        <span className="text-green-300">Kazanan: </span> {winner.player_name}
      </div>
      <div className={styles.losing_reason}>
        <span className="text-gray-400 font-bold"> Kaybetme Nedeni: </span>
        {losingReason === "duplicate"
          ? "Bu isim söylendi"
          : losingReason === "not_includes"
          ? "Böyle bir isim yok"
          : losingReason === "incorrect"
          ? "Bu isim önceki ismin bittiği harfle başlamıyor"
          : "Zaman doldu"}
      </div>
      <span className="text-left text-white w-full block px-2 my-2">
        Kelime Listesi
      </span>
      <div className={styles.wordList}>
        {wordList &&
          wordList.map((word, i) => {
            let Icon = i % 2 === 0 ? HiDesktopComputer : BsFillPersonFill;
            if (i === 0) {
              return (
                <div className="flex flex-col items-center gap-y-2">
                  <div>
                    {getWordWithoutLastChar(word)}
                    <span className="text-blue-300">
                      {getLastCharOfWord(word)}
                    </span>
                  </div>
                  <div>{<Icon />}</div>
                </div>
              );
            } else {
              return (
                <>
                  <div className="text-green-500 w-max">
                    <FaArrowRight />
                  </div>
                  <div className="flex flex-col items-center gap-y-2">
                    <div>
                      <span className="text-blue-300">{word.charAt(0)}</span>
                      {word.slice(1, word.length - 1)}
                      <span className="text-blue-300">
                        {getLastCharOfWord(word)}
                      </span>
                    </div>
                    <div>{<Icon />}</div>
                  </div>
                </>
              );
            }
          })}
      </div>

      <button className={styles.restart} onClick={onRestart}>
        Yeniden Oyna
      </button>
    </div>
  );
};

export default Results;
