import { useState } from "react"
import { CHATBOT_NAME } from "~/constants/env"

interface Props {}

export default function HelpText({}: Props) {
  const [show, setShow] = useState(true)

  if (!show) return null

  return (
    <div className="mx-auto flex items-end gap-2">
      <div className="flex flex-shrink flex-col gap-2 rounded rounded bg-green-100 p-4">
        <p>
          With our chatbot {CHATBOT_NAME}, we want to guide you to learn some
          Python. The learning process is split into three phases.
        </p>
        <ol className="list-inside list-decimal">
          <li>
            <strong>Learn:</strong> you will watch a video and can ask questions
            about the topic.
          </li>
          <li>
            <strong>Test:</strong> the chatbot asks you questions which you can
            use to test your knowledge.
          </li>
          <li>
            <strong>Apply:</strong> you will apply your new knowledge by writing
            a short Python program with the help of {CHATBOT_NAME}.
          </li>
        </ol>
        <p>
          You can use the navigation to the left and right to switch between
          phases.
        </p>
      </div>
      <button
        className="btn-primary btn mt-2 rounded normal-case"
        onClick={() => setShow(false)}>
        OK, hide
      </button>
    </div>
  )
}
