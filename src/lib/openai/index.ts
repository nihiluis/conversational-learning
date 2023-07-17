import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionRequestMessage,
} from "openai"
import { OPENAI_MODEL_NAME } from "./params"
import { ChatMessage } from "~/state"
import protect from "await-protect"
import { uuidv4 } from "~/constants/reexports"
import { AxiosError } from "axios"

export const defaultOpenAIWrapper = getOpenAIWrapper(getOpenAIConfig(process.env.OPENAI_API_KEY))
export type OpenAIWrapper = typeof defaultOpenAIWrapper

export function getOpenAIConfig(apiKey?: string) {
  return new Configuration({
    apiKey,
  })
}

export function getOpenAIWrapper(config: Configuration) {
  return new OpenAIApi(config)
}

export function createQueryMessage(
  role: ChatCompletionRequestMessageRoleEnum,
  text: string
): ChatCompletionRequestMessage {
  return { role, content: text }
}

export async function queryTutor(
  openaiWrapper: OpenAIWrapper,
  messages: ChatMessage[]
): Promise<ChatMessage> {
  const filteredMessages = messages
    .filter(msg => msg.addToPrompt)
    .map(msg => createQueryMessage(msg.role, msg.text))

  const [res, err] = await protect(
    openaiWrapper.createChatCompletion({
      model: OPENAI_MODEL_NAME,
      messages: filteredMessages,
      temperature: 0,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
  )

  if (err) {
    const axiosErr = err as AxiosError

    const statusCode = axiosErr?.response?.status ?? -1
    if (statusCode === 401) {
      return {
        id: uuidv4(),
        text: "Unable to perform authorization with the ChatGPT API. Is the OpenAI access key correct?",
        role: "system",
        addToPrompt: false,
        showInUi: true,
        error: err.message,
        type: "error",
      }
    }

    return {
      id: uuidv4(),
      text: "An error occured while querying the ChatGPT API.",
      role: "system",
      addToPrompt: false,
      showInUi: true,
      error: err.message,
      type: "error",
    }
  }

  const answer = res!.data.choices[0]?.message
  if (!answer) {
    return {
      id: uuidv4(),
      text: "Unable to read response from GPT",
      role: "system",
      addToPrompt: false,
      showInUi: true,
      error: "",
      type: "error",
    }
  }

  return {
    id: uuidv4(),
    text: answer.content,
    role: answer.role,
    addToPrompt: true,
    showInUi: true,
    error: "",
    type: "default",
  }
}
