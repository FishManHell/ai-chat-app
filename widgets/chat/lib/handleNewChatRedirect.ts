import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export async function handleNewChatRedirect(
  router: AppRouterInstance,
  chatId: string | undefined,
) {
  if (chatId) return

  const res = await fetch("/api/chat/latest")
  if (res.ok) {
    const { chatId: newChatId } = await res.json()
    if (newChatId) {
      router.push(`/chat/${newChatId}`)
      return
    }
  }
  router.refresh()
}
