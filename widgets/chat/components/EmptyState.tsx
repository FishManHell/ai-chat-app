import { cn } from "@/shared/lib/utils"

export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4">
      <div
        className={cn(
          "h-16 w-16 rounded-full",
          "shadow-lg"
        )}
        style={{
          background: "linear-gradient(135deg, #E8935A, #C17AEF, #7B8CED)",
          boxShadow: "0 0 32px rgba(193, 122, 239, 0.3)",
        }}
      />
      <h2 className="text-foreground text-xl font-semibold">
        How can I help you today?
      </h2>
      <p className="text-muted-foreground max-w-sm text-center text-sm">
        Start a conversation with AI Chat. Ask anything — from coding questions
        to creative writing.
      </p>
    </div>
  )
}
