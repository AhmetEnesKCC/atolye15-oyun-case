import React, { FC } from "react";
import { getLastCharOfWord } from "../utils/getLastCharOFWord";
import { getWordWithoutLastChar } from "../utils/getWordWithoutLastChar";
import styles from "./player_wrapper.module.css";

type PlayerWrapperProps = {
  icon: any;
  name: string;
  answer: string;
};

const PlayerWrapper: FC<PlayerWrapperProps> = ({
  icon: Icon,
  name,
  answer,
}) => {
  return (
    <div className={styles.player_wrapper}>
      <Icon />
      {name}
      <div className={styles.word}>
        {answer && (
          <>
            {getWordWithoutLastChar(answer)}
            <span>{getLastCharOfWord(answer)}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerWrapper;
