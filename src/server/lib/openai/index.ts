import protect from "await-protect"
import axios from "axios"
import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionRequestMessage,
} from "openai"
import { OPENAI_MODEL_NAME } from "./params"

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

export async function queryContext(
  openaiWrapper: OpenAIApi,
  messages: ChatCompletionRequestMessage[]
): Promise<string> {
  const [res, err] = await protect(openaiWrapper.createChatCompletion({
    model: OPENAI_MODEL_NAME,
    messages,
    temperature: 0,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  }))

  if (err || !res!.data) {
    console.error(err?.message)
    return ""
  }

  const answer = res!.data.choices[0]?.message
  if (!answer) {
    return "Unable to read response from GPT"
  }

  return answer.content
}
