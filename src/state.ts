import { atom } from "recoil"
import { WELCOME_MESSAGE } from "./constants/messages"

export interface ChatMessage {
    id: string
    text: string
    role: "user" | "system"
    // whether the message should be added to the prompt
    addToPrompt: boolean
}

export const chatMessagesState = atom<ChatMessage[]>({
  key: "chatMessages",
  default: [{
    id: "",
    text: WELCOME_MESSAGE,
    role: "system",
    addToPrompt: false,
  },{
    id: "2",
    text: "I want to eat so badly...",
    role: "user",
    addToPrompt: false,
  }],
})
