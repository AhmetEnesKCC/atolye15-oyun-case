import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import Form from "../components/form";
import GameWindow from "../components/gameWindow";
import { useSelector } from "react-redux";
import { RootState } from "../Redux";

const Home: NextPage = () => {
  const settings = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    localStorage.setItem("voice_access", "prompt");
  });

  return (
    <>
      <Head>
        <title>İsim Tamamlama Oyunu</title>
        <meta name="description" content="Isim Tamamlama Oyunu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.wrapper}>
        <div className={styles.title}>İsim Tamamlama Oyunu</div>
        <Form />
        {settings.valid && <GameWindow gameSettings={settings} />}
      </main>
    </>
  );
};

export default Home;
