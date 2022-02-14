import { useEffect, useState } from "react";

type AddFunc = (word: string) => void;

type ResetFunc = () => void;

type WordList = {
  state: string[];
  addList: AddFunc;
  resetList: ResetFunc;
};

const useWordList = () => {
  // state, adder

  const [list, setList] = useState<string[]>([]);

  // add function

  const addList: AddFunc = (word) => {
    setList([...list, word]);
  };

  const resetList: ResetFunc = () => {
    setList([]);
  };

  const listObject: WordList = {
    state: list,
    addList,
    resetList,
  };

  return listObject;
};

export default useWordList;
