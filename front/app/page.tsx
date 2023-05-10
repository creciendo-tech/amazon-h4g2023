import Image from 'next/image'
import styles from './page.module.css'
import VoiceRecorder from './VoiceRecorder'

export default function Home() {
  return (
    <main className={styles.main}>
      <VoiceRecorder />
    </main>
  )
}
