import { atom, selector } from "recoil"
import { WELCOME_MESSAGE } from "./constants/messages"
import { isDevelopmentMode } from "./constants/env"
import { EduCourse, EduLecture, EduUser } from "@prisma/client"
import { CourseWithLectures } from "./server/api/routers/onboarding"
import { LOCAL_STORAGE_OPENAI_ACCESS_KEY } from "./constants/key"
import { uuidv4 } from "./constants/reexports"

export type ChatMessageType = "default" | "error" | "warning"

export interface ChatMessage {
  id: string
  text: string
  type: ChatMessageType
  role: "user" | "system" | "assistant"
  // whether the message should be added to the prompt
  addToPrompt: boolean
  showInUi: boolean
  error: string
}

export interface Settings {
  openAiAccessKey: string
}

export type ChatPhase = "active" | "constructive" | "interactive"

export const localStorageLoaded = atom<boolean>({
  key: "localStorageLoaded",
  default: false,
})

function getDefaultSettings(): Settings {
  return { openAiAccessKey: "" }
}

export const settingsState = atom<Settings>({
  key: "settings",
  default: getDefaultSettings(),
})

export const settingsSelector = selector({
  key: "settingsSelector",
  get: ({ get }) => ({ ...get(settingsState) }),
  set: ({ set }, newValue) => {
    const { openAiAccessKey } = newValue as Settings

    if (localStorage) {
      localStorage.setItem(LOCAL_STORAGE_OPENAI_ACCESS_KEY, openAiAccessKey)
    }

    set(settingsState, newValue)
  },
})

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

export const userState = atom<EduUser | null>({
  key: "user",
  default: null,
})

export const chatMessagesState = atom<ChatMessage[]>({
  key: "chatMessages",
  default: [
    {
      id: uuidv4(),
      text: WELCOME_MESSAGE,
      role: "system",
      addToPrompt: false,
      showInUi: true,
      error: "",
      type: "default",
    },
  ],
})
