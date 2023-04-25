import { ChatMessage } from "~/state"
import { FiUser, FiMonitor } from "react-icons/fi"
import classNames from "classnames"

interface Props {
  message: ChatMessage
}

export default function ChatMessage({ message }: Props) {
  const isSystem = message.role === "system"

  return (
    <div
      className={classNames("w-full", {
        "bg-gray-100": isSystem,
        "bg-gray-200": !isSystem,
      })}>
      <div
        className={classNames(
          "m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-xl lg:px-0 xl:max-w-3xl"
        )}>
        <div className="flex w-[calc(100%-50px)] flex-grow gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
          {isSystem && <FiMonitor />}
          {!isSystem && <FiUser />}
          <div className=""></div>
          <p>{message.text}</p>
        </div>
      </div>
    </div>
  )
}
