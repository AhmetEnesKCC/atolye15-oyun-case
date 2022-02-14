import {
  GameSettings,
  Player,
  VoidFunctionWithParams,
  WordListenerCallback,
} from "../types";
import { v4 as uuid } from "uuid";
import { generateNumber } from "../utils/generateNumber";
import events from "events";

const eventEmitter = new events.EventEmitter();

class Game {
  name: string;
  wordList: string[] = [];
  grammar: string[] = [];
  settings: GameSettings;
  recognition: any;
  speaker: SpeechSynthesis | null = null;
  timerStarted: boolean = false;
  isTimeUp: boolean = false;
  isStarted: boolean = false;
  isRecognitionStarted: boolean = false;
  listeningId: string = "";
  currentWord: string = "";
  answer: string = "";
  onStart: null | VoidFunctionWithParams = null;

  // 2 Player version ( pc will start the game )
  player: Player = "pc";

  constructor(name: string, settings: GameSettings, grammar: string[]) {
    this.name = name;
    this.grammar = grammar;
    this.settings = settings;
    this.setRecognition();
    this.setSpeaker();
  }

  setRecognition: () => void = () => {
    //@ts-ignore
    this.recognition = new webkitSpeechRecognition();
    this.recognition.interimResults = false;
    this.recognition.continuous = false;
    this.recognition.lang = "tr-TR";

    this.recognition.onstart = () => {
      this.isRecognitionStarted = true;
      eventEmitter.emit("recognition-status", "start");
    };

    this.recognition.onresult = (e: any) => {
      eventEmitter.emit("recognition-status", "end");

      this.answer = e.results[0][0].transcript
        .replaceAll(".", "")
        .toLowerCase();
      this.sendWord(this.answer);
      if (this.checkIsWordValid(this.answer)) {
        this.currentWord = this.answer;
        this.addList(this.currentWord);
        this.nextRound();
      } else {
        this.speak("Hatalı isim");
        this.finish();
      }
    };

    this.recognition.onend = () => {
      eventEmitter.emit("recognition-status", "end");
      this.isRecognitionStarted = false;
    };
  };

  setSpeaker: () => void = () => {
    this.speaker = window.speechSynthesis;
  };

  getLastCharacterOfWord: (word: string) => string = (word) => {
    return word.charAt(word.length - 1);
  };

  getWordStartWithLastChar: (char: string) => string = (char) => {
    let filteredResults = this.grammar.filter(
      (word) => word.charAt(0) === char
    );
    let filteredResultsLength = filteredResults.length;
    let randomAnswerIndex = generateNumber(0, filteredResultsLength - 1);
    return filteredResults[randomAnswerIndex];
  };

  addWordListener = (cb: WordListenerCallback) => {
    eventEmitter.addListener("word", cb);
  };

  removeWordListener = () => {
    eventEmitter.removeAllListeners("word");
  };

  addFinishListener = (cb: (winner: Player) => any) => {
    eventEmitter.addListener("finish", cb);
  };

  removeFinishListener = () => {
    eventEmitter.removeAllListeners("finish");
  };

  addTimerListener = (cb: (type: "start" | "end") => {}) => {
    eventEmitter.addListener("timer", cb);
  };

  removeTimerListener = () => {
    eventEmitter.removeAllListeners("timer");
  };

  addRecognitionStatusListener = (cb: (status: "start" | "end") => any) => {
    eventEmitter.addListener("recognition-status", cb);
  };

  removeRecognitionStatusListener = () => {
    eventEmitter.removeAllListeners("recognition-status");
  };

  switchPlayer = () => {
    switch (this.player) {
      case "human":
        this.player = "pc";
        break;
      case "pc":
        this.player = "human";
        break;
      // Won't reach here due to player type : pc | human ( for prevent the scenarios which maybe the typescript work wrong )
      default:
        this.player = this.player;
    }
  };

  utter: (word: string) => SpeechSynthesisUtterance = (word) => {
    let utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "tr-TR";
    return utterance;
  };

  speak: (word: string) => void = (word) => {
    this.speaker?.speak(this.utter(word));
  };

  waitTillSpeakingFinish = (cb: VoidFunctionWithParams) => {
    if (this.speaker?.speaking) {
      setTimeout(() => this.waitTillSpeakingFinish(cb), 100);
    } else cb();
  };

  nextRound: () => void = () => {
    // Created id to keep track of current listener

    // Reset The answer to detect time up

    this.answer = "";

    this.listeningId = uuid();
    let timerId = this.listeningId;

    // Switch for every round
    this.switchPlayer();

    // Started timer

    this.startTimer(timerId);

    // if player is pc

    if (this.player === "pc") {
      let winRate = this.settings.difficulty;
      const willPcWinThisRound: boolean = Math.random() <= winRate;
      if (willPcWinThisRound) {
        // 1 - 7 seconds to pc thinking
        const randomTimeForPCSpeak = generateNumber(1, 7);
        let pcAnswer = this.getWordStartWithLastChar(
          this.currentWord.charAt(this.currentWord.length - 1)
        );
        setTimeout(() => {
          this.sendWord(pcAnswer);
          this.speak(pcAnswer);
          this.answer = pcAnswer;
          this.currentWord = pcAnswer;
          this.nextRound();
        }, randomTimeForPCSpeak * 1000);
      }
      // else pc will lose
    }

    // else player is human
    else {
      if (!this.isRecognitionStarted) {
        this.waitTillSpeakingFinish(() => this.recognition.start());
      }
    }

    // else
  };

  sendWord: (word: string) => void = (word) => {
    eventEmitter.emit("word", { word, player: this.player });
  };

  start: (onStart?: VoidFunctionWithParams) => void = (onStart) => {
    if (this.isStarted === false) {
      this.isStarted = true;
      const randomNameIndex = generateNumber(0, this.grammar.length);
      this.currentWord = this.grammar[randomNameIndex];
      this.answer = this.currentWord;
      this.speak(this.currentWord);
      this.sendWord(this.currentWord);
      onStart?.();
      this.nextRound();
    }
  };

  reset: () => void = () => {
    this.wordList = [];
    this.player = "pc";
  };

  checkIsWordValid: (word: string) => boolean = (word) => {
    return (
      this.grammar.includes(word) &&
      !this.wordList.includes(word) &&
      this.getLastCharacterOfWord(this.currentWord) === word.charAt(0)
    );
  };

  addList: (word: string) => void = (word) => {
    this.wordList.push(word);
  };

  finish: () => void = () => {
    // Switch player because will send winner not loser
    this.switchPlayer();
    eventEmitter.emit("finish", this.player);
  };

  startTimer: (id: string | null) => void = (id) => {
    eventEmitter.emit("timer", "start");
    setTimeout(() => {
      // chech if the listening is not tangled with previous listenings
      if (id === this.listeningId) {
        if (!this.answer) {
          this.finish();
        }
        eventEmitter.emit("timer", "end");
      }
    }, 8000);
  };

  clear: VoidFunctionWithParams = () => {
    this.removeFinishListener();
    this.removeWordListener();
    this.removeTimerListener();
    this.removeRecognitionStatusListener();
    this.listeningId = "";
    this.recognition.stop();
    this.speaker?.cancel();
  };
}

export default Game;
