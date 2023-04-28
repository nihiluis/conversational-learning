import { ChatMessage, debugState } from "~/state"
import { FiUser, FiMonitor, FiRepeat } from "react-icons/fi"
import classNames from "classnames"
import { PropsWithChildren, useEffect, useState } from "react"
import { MessageComponent, getMessageComponents } from "~/lib/message"
import { useRecoilState } from "recoil"

interface Props {
  message: ChatMessage
  isLastMessage: boolean
  retryLastMessage: () => void
}

export default function ChatMessageContainer({
  message,
  isLastMessage,
  retryLastMessage,
}: Props) {
  const isSystem = message.role === "system" || message.role === "assistant"

  const [debug] = useRecoilState(debugState)
  const [messageComponents, setMessageComponents] = useState<
    MessageComponent[]
  >([])

  useEffect(() => {
    const newMessageComponents = getMessageComponents(message.text)

    setMessageComponents(newMessageComponents)
  }, [message.text])

  return (
    <div
      className={classNames(
        "w-full border-b border-solid border-gray-200 last:border-b-0",
        {
          "bg-gray-50": isSystem,
          "bg-white": !isSystem,
        }
      )}>
      <div
        className={classNames(
          "m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-xl lg:px-0 xl:max-w-3xl"
        )}>
        <div className="flex w-[calc(100%-50px)] flex-grow gap-1 text-gray-700 md:gap-3 lg:w-[calc(100%-115px)]">
          {isSystem && <ChatAssistantAvatar />}
          {!isSystem && <ChatUserAvatar />}
          <div className="flex gap-4">
            <div className="flex flex-col items-start gap-2">
              {message.error.length > 0 &&
                (debug ? message.error : message.text)}
              {message.error.length === 0 &&
                messageComponents.map((msg, idx) => (
                  <div key={`msgcomponent-${idx}`}>
                    {msg.type === "text" && (
                      <ChatTextComponent>{msg.text}</ChatTextComponent>
                    )}
                    {msg.type === "terminal" && (
                      <ChatTerminalComponent>{msg.text}</ChatTerminalComponent>
                    )}
                  </div>
                ))}
            </div>
            {isLastMessage && message.error.length > 0 && (
              <div className="cursor-pointer self-start rounded-full bg-red-400 p-1 text-white hover:bg-red-600">
                <FiRepeat onClick={retryLastMessage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface TextProps extends PropsWithChildren<{}> {}

function ChatTextComponent({ children }: TextProps) {
  return <p>{children}</p>
}
function ChatTerminalComponent({ children }: TextProps) {
  return (
    <code className="flex whitespace-pre-wrap rounded bg-gray-900 p-4 text-gray-50">
      {children}
    </code>
  )
}

function ChatAssistantAvatar() {
  return (
    <div className="flex items-start justify-center rounded-full bg-blue-200 px-1 py-2">
      <FiMonitor className="shrink-0" />
    </div>
  )
}

function ChatUserAvatar() {
  return (
    <div className="rounded-full bg-green-200 p-1">
      <FiUser className="shrink-0" />
    </div>
  )
}
