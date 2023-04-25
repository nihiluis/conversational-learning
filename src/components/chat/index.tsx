import { useRecoilState } from "recoil"
import { chatMessagesState } from "~/state"
import ChatMessage from "./ChatMessage"
import { FiSend } from "react-icons/fi"
import { useCallback, useState } from "react"

interface Props {}

export default function Chat({}: Props) {
  const [chatMessages, setChatMessages] = useRecoilState(chatMessagesState)
  const [textareaText, setTextareaText] = useState("")

  const sendUserMessage = useCallback(() => {
    const currentMessages = [...chatMessages]
    currentMessages.push({
      id: "Test",
      role: "user",
      text: textareaText,
      addToPrompt: false,
    })

    setTextareaText("")

    setChatMessages(currentMessages)
  }, [chatMessages, setChatMessages, textareaText, setTextareaText])

  return (
    <div className="">
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
          className="absolute bottom-0 right-0 cursor-pointer text-gray-600"
          onClick={sendUserMessage}>
          <FiSend className="mb-3 mr-3" />
        </div>
      </div>
    </div>
  )
}
