import logoImg from '../../assets/logo.svg'
import { useEffect, useState } from 'react'
import { api } from '../../services/api'

import styles from './styles.module.scss'

interface Message {
  id: string
  text: string
  user: {
    name: string
    avatar_url: string
  }
}

export const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    api.get<Message[]>('messages/last3').then((response) => {
      setMessages(response.data)
    })
  }, [])
  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map((m) => (
          <li key={m.id} className={styles.message}>
            <p className={styles.messageContent}>{m.text}</p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={m.user.avatar_url} alt={m.user.name} />
              </div>
              <span>{m.user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
