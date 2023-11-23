import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from "next/link";
import {Button} from "@mui/material";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <meta property="og:title" content="Dashboard" key="title" />
      </Head>
      <h1>Page Under Construction...</h1>
      <Link href="/beatsheets">
        <Button size="small" color="primary">Go to your Beatsheets</Button>
      </Link>
    </div>
  );
}
