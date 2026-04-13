import { ChatWindow } from "@/widgets/chat/ChatWindow"
import { getChats } from "@/features/manage-chats/lib/chat-actions"

const ChatPage = async () => {
  const chats = await getChats()

  return <ChatWindow initialChats={chats} />
}

export default ChatPage
