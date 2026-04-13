"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp, Square } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        onSend(input.trim())
        setInput("")
      }
    }
  }

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm p-3 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "mx-auto flex max-w-3xl items-end gap-2",
          "rounded-2xl border border-input-border bg-input p-2"
        )}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          rows={1}
          disabled={isLoading}
          className={cn(
            "flex-1 resize-none bg-transparent px-2 py-1.5",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "outline-none",
            "max-h-[200px] min-h-[36px]"
          )}
        />
        {isLoading ? (
          <Button
            type="button"
            size="icon"
            onClick={onStop}
            className={cn(
              "h-9 w-9 shrink-0 rounded-xl",
              "bg-muted text-muted-foreground",
              "hover:bg-muted/80 transition-colors"
            )}
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className={cn(
              "h-9 w-9 shrink-0 rounded-xl",
              "bg-gradient-to-r from-[var(--aurora-start)] to-[var(--aurora-mid)]",
              "text-white shadow-md shadow-[var(--glow-primary)]",
              "hover:opacity-90 transition-all duration-200",
              "disabled:opacity-40 disabled:shadow-none"
            )}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  )
}
