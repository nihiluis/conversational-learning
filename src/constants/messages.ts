import { ChatMessage, ChatMessageType } from "~/state"
import { SITE_NAME } from "./env"

export const WELCOME_MESSAGE =
  `Hey! I'm ${SITE_NAME} and here to help you learn. Write anything to start 😊.`

export const NO_PERMISSION = `You don't have a verified account and currently can not use the app as-is. To use the app, please enter your
OpenAI API token in the settings. The token will not be shared and will
only be used locally within your browser.`

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
