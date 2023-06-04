import { useRecoilState } from "recoil"
import { ChatMessage, ChatPhase, chatMessagesState } from "~/state"
import ChatMessageContainer from "./ChatMessageContainer"
import { FiLoader, FiSend } from "react-icons/fi"
import { useCallback, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { api } from "~/utils/api"
import {
  CONSTRUCTIVE_GENERATE_QUESTION_PROMPT,
  INTERACTIVE_GENERATE_TASK_PROMPT,
} from "~/constants/prompts"
import { queryTutor } from "~/server/lib/openai"
import { PHASE_CONSTRUCTIVE, PHASE_INTERACTIVE } from "~/constants/chat"

interface Props {
  currentPhase: ChatPhase
  phase: ChatPhase
  messages: ChatMessage[]
  setMessages: (phase: ChatPhase, messages: ChatMessage[]) => void
}

export default function Chat({
  phase,
  currentPhase,
  messages,
  setMessages,
}: Props) {
  const [textareaText, setTextareaText] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [initializeRunTried, setInitializeRunTried] = useState(false)
  const ctx = api.useContext()

  const fetchMessages = useCallback(
    async (messages: ChatMessage[]) => {
      setChatLoading(true)

      const answerMessage = await ctx.chat.queryTutor.fetch({
        phase,
        messages,
      })
      const messagesWithAnswer = [...messages, answerMessage]

      setMessages(phase, messagesWithAnswer)

      setChatLoading(false)
    },
    [phase, setChatLoading, setMessages]
  )

  const sendUserMessage = useCallback(async () => {
    if (textareaText === "") return
    if (chatLoading) return

    const currentMessages = [...messages]
    currentMessages.push({
      id: uuidv4(),
      role: "user",
      text: textareaText,
      addToPrompt: true,
      showInUi: true,
      error: "",
    })

    setMessages(phase, currentMessages)

    await fetchMessages(currentMessages)

    setTextareaText("")
  }, [
    phase,
    messages,
    setMessages,
    textareaText,
    setTextareaText,
    chatLoading,
    setChatLoading,
    fetchMessages,
  ])

  const generateInteractiveTask = useCallback(
    async (showInUi: boolean) => {
      if (chatLoading) return

      const currentMessages = [...messages]
      currentMessages.push({
        id: uuidv4(),
        role: "assistant",
        text: INTERACTIVE_GENERATE_TASK_PROMPT,
        addToPrompt: true,
        showInUi,
        error: "",
      })

      setMessages(phase, currentMessages)

      await fetchMessages(currentMessages)
    },
    [messages, setMessages, chatLoading, setChatLoading, fetchMessages]
  )

  const requestQuestion = useCallback(
    async (showInUi: boolean) => {
      if (chatLoading) return

      const currentMessages = [...messages]
      currentMessages.push({
        id: uuidv4(),
        role: "user",
        text: CONSTRUCTIVE_GENERATE_QUESTION_PROMPT,
        addToPrompt: true,
        showInUi,
        error: "",
      })

      setMessages(phase, currentMessages)

      await fetchMessages(currentMessages)
    },
    [messages, setMessages, chatLoading, setChatLoading, fetchMessages]
  )

  const retryLastMessage = useCallback(async () => {
    if (chatLoading) return

    const retryMessages = [...messages]
    const lastMessage = retryMessages[retryMessages.length - 1]
    if (lastMessage?.role === "system") {
      retryMessages.pop()
    }

    setMessages(phase, retryMessages)

    await fetchMessages(retryMessages)
  }, [messages, phase, setChatLoading, fetchMessages])

  useEffect(() => {
    if (initializeRunTried) {
      return
    }

    if (phase !== currentPhase) {
      return
    }

    const promptMessages = messages.filter(msg => msg.addToPrompt)
    if (phase === PHASE_CONSTRUCTIVE && promptMessages.length === 0) {
      requestQuestion(false)
      setInitializeRunTried(true)
    }
  }, [])

  useEffect(() => {
    if (initializeRunTried) {
      return
    }

    if (phase !== currentPhase) {
      return
    }

    const promptMessages = messages.filter(msg => msg.addToPrompt)
    if (phase === PHASE_INTERACTIVE && promptMessages.length === 0) {
      generateInteractiveTask(false)
      setInitializeRunTried(true)
    }
  }, [])

  const filteredMessages = messages.filter(msg => msg.showInUi)

  return (
    <div className="mx-auto lg:max-w-4xl xl:max-w-6xl">
      <div className="mb-4 flex flex-col justify-end gap-2">
        <div className="flex flex-col overflow-hidden rounded drop-shadow-sm">
          {filteredMessages.map((msg, idx) => (
            <ChatMessageContainer
              key={`chatmsg-${msg.id}`}
              message={msg}
              isLastMessage={idx == filteredMessages.length - 1}
              retryLastMessage={retryLastMessage}
            />
          ))}
        </div>
      </div>
      <div className="relative flex">
        <div className="relative flex w-full gap-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
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
        <div className="absolute right-0 flex">
          {phase === PHASE_CONSTRUCTIVE && (
            <button
              className="rounded bg-green-300 p-2 drop-shadow-sm hover:bg-green-400"
              onClick={() => requestQuestion(false)}>
              Next question
            </button>
          )}
          {phase === PHASE_INTERACTIVE && (
            <button className="rounded bg-green-300 p-2 drop-shadow-sm hover:bg-green-400">
              Help me
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
