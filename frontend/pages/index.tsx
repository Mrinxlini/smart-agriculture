import Heading from '@components/heading/Heading';
import MembersView from '@components/members/Members';
import ThematicMap from '@components/thematicMap/ThematicMap';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Agriculture</title>
        <meta
          name="description"
          content="Visual representation of data from sensors used in agriculture as thematic map"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-6xl mx-auto px-[5%]">
        {/* heading */}
        <Heading />

        {/* thematic map */}
        <ThematicMap />

        {/* members */}
        <MembersView />
      </main>
    </div>
  );
}
