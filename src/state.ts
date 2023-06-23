import { atom } from "recoil"
import {
  WELCOME_MESSAGE_ACTIVE,
  WELCOME_MESSAGE_CONSTRUCTIVE,
  WELCOME_MESSAGE_INTERACTIVE,
} from "./constants/messages"
import { isDevelopmentMode } from "./constants/env"
import { EduCourse, EduLecture } from "@prisma/client"
import { CourseWithLectures } from "./server/api/routers/onboarding"

export interface ChatMessage {
  id: string
  text: string
  role: "user" | "system" | "assistant"
  // whether the message should be added to the prompt
  addToPrompt: boolean
  showInUi: boolean
  error: string
}

export type ChatPhase = "active" | "constructive" | "interactive"

export const debugState = atom<boolean>({
  key: "debug",
  default: isDevelopmentMode(),
})

export const lectureState = atom<EduLecture | null>({
  key: "lecture",
  default: null,
})

export const courseState = atom<CourseWithLectures | null>({
  key: "course",
  default: null,
})

export const chatMessagesState = atom<Record<ChatPhase, ChatMessage[]>>({
  key: "chatMessages",
  default: {
    active: [
      {
        id: "",
        text: WELCOME_MESSAGE_ACTIVE,
        role: "system",
        addToPrompt: false,
        showInUi: true,
        error: "",
      },
    ],
    constructive: [
      {
        id: "",
        text: WELCOME_MESSAGE_CONSTRUCTIVE,
        role: "system",
        addToPrompt: false,
        showInUi: true,
        error: "",
      },
    ],
    interactive: [
      {
        id: "",
        text: WELCOME_MESSAGE_INTERACTIVE,
        role: "system",
        addToPrompt: false,
        showInUi: true,
        error: "",
      },
    ],
  },
})
