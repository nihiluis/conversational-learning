import { useRecoilState } from "recoil"
import { chatMessagesState } from "~/state"
import ChatMessage from "./ChatMessage"
import { FiLoader, FiSend } from "react-icons/fi"
import { useCallback, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { api } from "~/utils/api"
import { appRouter } from "~/server/api/root"

interface Props {}

export default function Chat({}: Props) {
  const [chatMessages, setChatMessages] = useRecoilState(chatMessagesState)
  const [textareaText, setTextareaText] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const ctx = api.useContext()

  const sendUserMessage = useCallback(async () => {
    if (textareaText === "") return
    if (chatLoading) return

    const currentMessages = [...chatMessages]
    currentMessages.push({
      id: uuidv4(),
      role: "user",
      text: textareaText,
      addToPrompt: true,
    })

    setChatMessages(currentMessages)

    setTextareaText("")
    setChatLoading(true)

    const answerMessage = await ctx.chat.queryTutor.fetch({
      messages: currentMessages,
    })
    const messagesWithAnswer = [...currentMessages, answerMessage]

    setChatMessages(messagesWithAnswer)
    setChatLoading(false)
  }, [
    chatMessages,
    setChatMessages,
    textareaText,
    setTextareaText,
    chatLoading,
    setChatLoading,
  ])

  return (
    <div className="m-auto max-w-6xl drop-shadow-sm">
      <div className="mb-4 flex flex-col overflow-hidden rounded">
        {chatMessages.map(msg => (
          <ChatMessage key={`chatmsg-${msg.id}`} message={msg} />
        ))}
      </div>
      <div className="relative flex gap-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <textarea
          placeholder="Send a message."
          value={textareaText}
          onChange={event => setTextareaText(event.target.value)}
          className="textarea-bordered textarea flex-grow"
        />
        <div
          className="absolute bottom-0 right-0 text-gray-600"
          onClick={sendUserMessage}>
          {chatLoading && <FiLoader className="mb-3 mr-3 animate-spin" />}
          {!chatLoading && <FiSend className="mb-3 mr-3 cursor-pointer" />}
        </div>
      </div>
    </div>
  )
}
