export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div
        className="mt-1 h-8 w-8 shrink-0 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, #E8935A, #C17AEF, #7B8CED)",
        }}
      />
      <div className="border-border bg-card rounded-2xl border px-4 py-3">
        <div className="flex gap-1.5">
          <span className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:0ms]" />
          <span className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:150ms]" />
          <span className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}
