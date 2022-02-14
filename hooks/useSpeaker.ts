import { useEffect, useLayoutEffect, useState } from "react";

const useSpeaker = () => {
  const [speaker, setSpeaker] = useState<SpeechSynthesis | null>(null);
  const [status, setStatus] = useState<any>("");

  useEffect(() => {
    setSpeaker(window.speechSynthesis);
  }, []);

  const speak = (word: string) => {
    let utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "tr-TR";
    speaker && speaker.speak(utterance);
  };

  return {
    speaker,
    speak,
  };
};

export default useSpeaker;
