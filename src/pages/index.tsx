import Head from "next/head";
import CryptoList from "./components/CryptoList";

export default function Home() {
  return (
    <>
      <Head>
        <title>Crypto Manager</title>
      </Head>
      <main style={{ padding: "2rem" }}>
        <h1>Admin Criptomonede</h1>
        <CryptoList />
      </main>
    </>
  );
}
