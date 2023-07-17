import { useRecoilState } from "recoil"
import {
  ChatMessage,
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
import { canUserWriteMessage, hasUserServerOpenAiAccess } from "~/lib/user"
import classNames from "classnames"
import {
  NO_COURSE_LECTURE_SELECTED,
  NO_PERMISSION,
  createClientOnlySystemMessage,
} from "~/constants/messages"
import { generateBasePrompt } from "~/server/lib/generateBasePrompt"
import {
  OpenAIWrapper,
  getOpenAIConfig,
  getOpenAIWrapper,
  queryTutor,
} from "~/lib/openai"

interface Props {
  messages: ChatMessage[]
  setMessages: (messages: ChatMessage[]) => void
}

export default function Chat({ messages, setMessages }: Props) {
  const [textareaText, setTextareaText] = useState("")
  const [initializeRunTried, setInitializeRunTried] = useState(false)
  const [localAnswerIsLoading, setLocalAnswerIsLoading] = useState(false)
  const [isReadyToStart, setIsReadyToStart] = useState(false)
  const [openAiWrapper, setOpenAiWrapper] = useState<OpenAIWrapper>()

  const [userData] = useRecoilState(userState)
  const [settings] = useRecoilState(settingsState)
  const [activeCourse] = useRecoilState(courseState)
  const [activeLecture] = useRecoilState(lectureState)

  const resolveAnswerMutation = api.chat.resolveAnswer.useMutation()

  const canSendMessages = canUserWriteMessage(userData, settings)
  const hasServerOpenAiAccess = hasUserServerOpenAiAccess(userData)

  const chatLoading = resolveAnswerMutation.isLoading || localAnswerIsLoading

  useEffect(() => {
    const openAiWrapper = getOpenAIWrapper(
      getOpenAIConfig(settings.openAiAccessKey)
    )

    setOpenAiWrapper(openAiWrapper)
  }, [settings.openAiAccessKey])

  const fetchMessages = useCallback(
    async (messages: ChatMessage[]) => {
      if (hasServerOpenAiAccess) {
        resolveAnswerMutation.mutate({ messages })
      } else {
        if (!openAiWrapper) {
          return
        }

        setLocalAnswerIsLoading(true)
        const responseMessage = await queryTutor(openAiWrapper, messages)
        setLocalAnswerIsLoading(false)
        setMessages([...messages, responseMessage])
      }
    },
    [
      resolveAnswerMutation,
      canSendMessages,
      setLocalAnswerIsLoading,
      setMessages,
      openAiWrapper,
    ]
  )

  useEffect(() => {
    const answerMessage = resolveAnswerMutation.data
    if (!answerMessage) {
      return
    }

    const messagesWithAnswer = [...messages, answerMessage]
    setMessages(messagesWithAnswer)
  }, [resolveAnswerMutation.data])

  const sendUserMessage = useCallback(async () => {
    if (textareaText === "") return
    if (chatLoading) return
    if (!canSendMessages) return

    const currentMessages = [...messages]
    if (currentMessages.length === 1) {
      // only welcome message is in => tells the app that the user is ready to start
      setIsReadyToStart(true)
      setTextareaText("")
      return
    }

    currentMessages.push({
      id: uuidv4(),
      role: "user",
      text: textareaText,
      addToPrompt: true,
      showInUi: true,
      error: "",
      type: "default",
    })

    setMessages(currentMessages)

    await fetchMessages(currentMessages)

    setTextareaText("")
  }, [
    messages,
    setMessages,
    textareaText,
    setTextareaText,
    fetchMessages,
    setIsReadyToStart,
  ])

  const retryLastMessage = useCallback(async () => {
    if (chatLoading) return

    const retryMessages = [...messages]
    const lastMessage = retryMessages[retryMessages.length - 1]
    if (lastMessage?.role === "system") {
      retryMessages.pop()
    }

    setMessages(retryMessages)

    await fetchMessages(retryMessages)
  }, [messages, fetchMessages])

  useEffect(() => {
    if (!isReadyToStart) {
      return
    }

    if (initializeRunTried) {
      return
    }

    if (!activeLecture || !activeCourse) {
      return
    }

    const promptMessages = messages.filter(msg => msg.addToPrompt)
    if (promptMessages.length === 0) {
      const basePrompt = generateBasePrompt({
        lecture: activeLecture,
        course: activeCourse,
      })

      const newMessages: ChatMessage[] = [
        ...messages,
        {
          id: uuidv4(),
          text: basePrompt,
          type: "default",
          role: "system",
          addToPrompt: true,
          showInUi: false,
          error: "",
        },
      ]

      fetchMessages(newMessages)

      setMessages(newMessages)
      setInitializeRunTried(true)
    }
  }, [
    activeLecture,
    activeCourse,
    setInitializeRunTried,
    setMessages,
    fetchMessages,
    isReadyToStart,
  ])

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
          {false && (
            <button className="rounded-lg bg-green-300 p-2 drop-shadow-sm hover:bg-green-400">
              Help me
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
