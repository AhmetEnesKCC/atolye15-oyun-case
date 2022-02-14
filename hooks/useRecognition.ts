import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VoidFunctionWithParams } from "../types";

type WebkitRecognition = any;
type RecognitionResult = string;
type RecognitionStatus = "start" | "end" | "initial";

const useRecognition = (onResult: (...params: any[]) => any) => {
  const [recognition, setRecognition] = useState<WebkitRecognition>();
  const [status, setStatus] = useState<RecognitionStatus>("initial");
  const [result, setResult] = useState<RecognitionResult>("");

  const handleRecogniton = useCallback(() => {
    // @ts-ignore
    var local_recognition = new window.webkitSpeechRecognition();
    local_recognition.interimResults = false;
    local_recognition.continuous = false;
    local_recognition.lang = "tr-TR";

    local_recognition.onstart = () => {
      setStatus("start");
    };

    local_recognition.onresult = (e: any) => {
      let answer = e.results[0][0].transcript.replaceAll(".", "").toLowerCase();
      setResult(answer);
      onResult?.(answer);
    };

    local_recognition.onend = () => {
      setStatus("end");
    };

    setRecognition(local_recognition);
  }, []);

  useEffect(() => {
    handleRecogniton();
  }, []);

  return {
    recognition,
    recognitionStatus: status,
    recognitionResult: result,
  };
};

export default useRecognition;
