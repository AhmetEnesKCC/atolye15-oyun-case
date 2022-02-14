import Game from "./classes/Game";

export type GameSettings = {
  humanName: string;
  machineName: string;
  difficulty: 0.82 | 0.9 | 0.98;
  valid: boolean;
};

export type GameSettingHook = (
  setting: GameSettings,
  start: boolean
) => Game | null;

export type Player = "human" | "machine";

export type VoidFunctionWithParams = (...params: any[]) => void;

export type WordListenerResponse = { word: string; player: Player };

export type WordListenerCallback = (WordListenerResponse) => any;

export type RecognitionStatus = "start" | "end" | "initial";

export type GameHandlers = {
  handleStart: VoidFunctionWithParams;
  handleFinish: VoidFunctionWithParams;
  handleCancel: VoidFunctionWithParams;
  handleRestart: VoidFunctionWithParams;
};

export type LosingReasons =
  | "incorrect"
  | "duplicate"
  | "not_includes"
  | "time up";
