import React, { FC, FormEvent, LegacyRef, useRef, useState } from "react";
import { Input } from "reactstrap";
import styles from "./form.module.css";

import { setSettings } from "../Redux";
import { useDispatch } from "react-redux";

// Settings

const Form: FC = () => {
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const humanNameRef = useRef<HTMLInputElement>(null);
  const machineNameRef = useRef<HTMLInputElement>(null);
  const difficultyRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (humanNameRef.current?.value && machineNameRef.current?.value) {
      dispatch(
        setSettings({
          humanName: humanNameRef.current.value,
          machineName: machineNameRef.current.value,
          difficulty: parseFloat(
            difficultyRef.current?.querySelector("select")?.value!
          ) as 0.82 | 0.9 | 0.98,
          valid: true,
        })
      );
      return;
    }

    setErrorMessage("Please fill the names");
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} action="">
      <div>
        <label>Senin Adin (insan 🧑 - 👧)</label>
        <input type="text" name="pc_name" ref={humanNameRef} />
      </div>
      <div>
        <label>Dusmanin Adi (Makine 💻 - 📱)</label>
        <input type="text" name="human_name" ref={machineNameRef} />
      </div>
      <div ref={difficultyRef as LegacyRef<HTMLDivElement>}>
        <label>Zorluk</label>
        <Input type="select" defaultValue={0.82}>
          <option value={0.82}>Başlangıç ( Makine %82 bilir )</option>
          <option value={0.9}>Tecrübeli ( Makine %90 bilir )</option>
          <option value={0.98}>Uzman ( Makine %98 bilir )</option>
        </Input>
      </div>

      <div>
        {errorMessage && (
          <div className={styles.warning_message}>{errorMessage}</div>
        )}
        <button className={styles.submit_button}>Başlat</button>
      </div>
    </form>
  );
};

export default Form;
