import protect from "await-protect"
import axios from "axios"
import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionRequestMessage,
} from "openai"
import { OPENAI_MODEL_NAME } from "./params"
import { BASE_PROMPT } from "./prompts"
import { ChatMessage } from "~/state"

const openaiWrapper = getOpenAIWrapper()

export function getOpenAIConfig() {
  return new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
}
export function getOpenAIWrapper() {
  return new OpenAIApi(getOpenAIConfig())
}

export function createQueryMessage(
  role: ChatCompletionRequestMessageRoleEnum,
  text: string
): ChatCompletionRequestMessage {
  return { role, content: text }
}

export async function queryTutor(messages: ChatMessage[]): Promise<string> {
  const filteredMessages = messages
    .filter(msg => msg.addToPrompt)
    .map(msg => createQueryMessage(msg.role, msg.text))

  const wrappedMessages = [
    createQueryMessage("system", BASE_PROMPT),
    ...filteredMessages,
  ]

  const res = await openaiWrapper.createChatCompletion({
    model: OPENAI_MODEL_NAME,
    messages: wrappedMessages,
    temperature: 0,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  const answer = res!.data.choices[0]?.message
  if (!answer) {
    return "Unable to read response from GPT"
  }

  return answer.content
}
