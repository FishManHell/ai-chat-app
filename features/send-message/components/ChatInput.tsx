"use client"

import {useState, useRef, useEffect, SyntheticEvent, KeyboardEvent} from "react"
import { ArrowUp, Square } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { styles } from "./ChatInput.styles"

interface ChatInputProps {
  isLoading: boolean
  onSend: (text: string) => void
  onStop: () => void
}

export function ChatInput({ isLoading, onSend, onStop }: Readonly<ChatInputProps>) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [input])

  function send() {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput("")
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault()
    send()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          rows={1}
          disabled={isLoading}
          className={styles.textarea}
        />
        {isLoading ? (
          <Button type="button" size="icon" onClick={onStop} className={styles.stopButton}>
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" size="icon" disabled={!input.trim()} className={styles.sendButton}>
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  )
}
