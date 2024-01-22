/* import Image from 'next/image'
import styles from './page.module.css' */
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <Head>
        <title>FEDERACIÓN DE ARBITRAJE</title>
        <meta name="description" content="FEDERACIÓN DE ARBITRAJE" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
