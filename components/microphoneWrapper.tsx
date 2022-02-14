import React, { FC } from "react";
import { RecognitionStatus, VoidFunctionWithParams } from "../types";
import styles from "./microphone_wrapper.module.css";
import { IoMdMic } from "react-icons/io";

type MicWrapperProps = {
  recognitionStatus: RecognitionStatus;
  handleStart: VoidFunctionWithParams;
  started: boolean;
};

const MicrophoneWrapper: FC<MicWrapperProps> = (props) => {
  return (
    <div className={styles.microphone_wrapper}>
      <div
        className={`${styles.icon} ${
          props.recognitionStatus === "start" ? "animate-ping" : ""
        } `}
        onClick={props.handleStart}
      >
        <IoMdMic />
      </div>
      <span className="text-orange-500">
        {props.started
          ? "Oyunu Sonlardırmak için tıklayın"
          : "Başlamak için tıklayın"}
      </span>
    </div>
  );
};

export default MicrophoneWrapper;
