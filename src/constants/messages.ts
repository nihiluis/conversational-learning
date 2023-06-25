import { ChatMessage, ChatMessageType } from "~/state"

export const WELCOME_MESSAGE_ACTIVE =
  "I'm your helper to learn python for the next few minutes. Ask me questions about Python!"
export const WELCOME_MESSAGE_CONSTRUCTIVE =
  "I will ask you questions and you can answer to test the knowledge you learned. If the question is too hard and covers topic that you haven't touched on yet, just skip and ask for the next question. Let's start!"
export const WELCOME_MESSAGE_INTERACTIVE =
  "Lastly I want to test your knowledge."

export const NO_PERMISSION = `You don't have a verified account. To use the app, please enter your
OpenAI API token in the settings. The token will not be shared and
only used locally in your browser.`

export const NO_COURSE_LECTURE_SELECTED = `Hey! Please select a course and a lecture to start your learning journey.`

export function createClientOnlySystemMessage(
  text: string,
  type: ChatMessageType
): ChatMessage {
  return {
    id: "",
    text,
    role: "system",
    addToPrompt: false,
    showInUi: true,
    error: "",
    type,
  }
}
