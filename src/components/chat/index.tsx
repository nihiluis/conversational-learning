import { useRecoilState } from "recoil"
import {
  ChatMessage,
  ChatPhase,
  chatMessagesState,
  courseState,
  lectureState,
  settingsState,
  userState,
} from "~/state"
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
import { canUserWriteMessage } from "~/server/lib/user"
import classNames from "classnames"
import {
  NO_COURSE_LECTURE_SELECTED,
  NO_PERMISSION,
  createClientOnlySystemMessage,
} from "~/constants/messages"

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
  const [initializeRunTried, setInitializeRunTried] = useState(false)

  const [userData] = useRecoilState(userState)
  const [settings] = useRecoilState(settingsState)
  const [activeCourse] = useRecoilState(courseState)
  const [activeLecture] = useRecoilState(lectureState)

  const resolveAnswerMutation = api.chat.resolveAnswer.useMutation()
  const resolveLocalAnswerMutation = api.chat.resolveLocalAnswer.useMutation()

  const canSendMessages = canUserWriteMessage(userData, settings)

  const chatLoading =
    resolveAnswerMutation.isLoading || resolveLocalAnswerMutation.isLoading

  const fetchMessages = useCallback(
    async (messages: ChatMessage[]) => {
      resolveAnswerMutation.mutate({ phase, messages })
    },
    [resolveAnswerMutation, phase]
  )

  useEffect(() => {
    const answerMessage = resolveAnswerMutation.data
    if (!answerMessage) {
      return
    }

    const messagesWithAnswer = [...messages, answerMessage]
    setMessages(phase, messagesWithAnswer)
  }, [resolveAnswerMutation.data])

  const sendUserMessage = useCallback(async () => {
    if (textareaText === "") return
    if (chatLoading) return
    if (!canSendMessages) return

    const currentMessages = [...messages]
    currentMessages.push({
      id: uuidv4(),
      role: "user",
      text: textareaText,
      addToPrompt: true,
      showInUi: true,
      error: "",
      type: "default",
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
        type: "default",
      })

      setMessages(phase, currentMessages)

      await fetchMessages(currentMessages)
    },
    [messages, setMessages, fetchMessages]
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
        type: "default",
      })

      setMessages(phase, currentMessages)

      await fetchMessages(currentMessages)
    },
    [messages, setMessages, chatLoading, fetchMessages]
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
  }, [messages, phase, fetchMessages])

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

  const isCourseAndLectureSelected = !!activeCourse && !!activeLecture

  return (
    <div className="mx-auto lg:max-w-4xl xl:max-w-6xl">
      <div className="mb-4 flex flex-col justify-end gap-2">
        <div className="flex flex-col overflow-hidden rounded-lg drop-shadow-sm">
          {!canSendMessages && (
            <ChatMessageContainer
              message={createClientOnlySystemMessage(NO_PERMISSION, "error")}
              isLastMessage={false}
              retryLastMessage={retryLastMessage}
            />
          )}
          {canSendMessages && !isCourseAndLectureSelected && (
            <ChatMessageContainer
              message={createClientOnlySystemMessage(
                NO_COURSE_LECTURE_SELECTED,
                "warning"
              )}
              isLastMessage={false}
              retryLastMessage={retryLastMessage}
            />
          )}
          {canSendMessages &&
            isCourseAndLectureSelected &&
            filteredMessages.map((msg, idx) => (
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
            disabled={!canSendMessages}
            onChange={event => setTextareaText(event.target.value)}
            className="textarea flex-grow"
          />
          <div
            className="absolute bottom-0 right-0 text-gray-600"
            onClick={sendUserMessage}>
            {chatLoading && <FiLoader className="mb-3 mr-3 animate-spin" />}
            {!chatLoading && (
              <FiSend
                className={classNames("mb-3 mr-3", {
                  "cursor-pointer": canSendMessages,
                  "!text-gray-300": !canSendMessages,
                })}
              />
            )}
          </div>
        </div>
        <div className="absolute right-0 flex">
          {phase === PHASE_CONSTRUCTIVE && (
            <button
              className="rounded-lg bg-green-300 p-2 drop-shadow-sm hover:bg-green-400"
              onClick={() => requestQuestion(false)}>
              Next question
            </button>
          )}
          {phase === PHASE_INTERACTIVE && (
            <button className="rounded-lg bg-green-300 p-2 drop-shadow-sm hover:bg-green-400">
              Help me
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
