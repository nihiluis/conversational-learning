import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionRequestMessage,
} from "openai"
import { OPENAI_MODEL_NAME } from "./params"
import {
  BASE_ACTIVE_PROMPT,
  BASE_CONSTRUCTIVE_PROMPT,
  BASE_INTERACTIVE_PROMPT,
} from "~/constants/prompts"
import { ChatMessage, ChatPhase } from "~/state"
import {
  PHASE_ACTIVE,
  PHASE_CONSTRUCTIVE,
  PHASE_INTERACTIVE,
} from "~/constants/chat"

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

function getBasePrompt(phase: ChatPhase): string {
  switch (phase) {
    case PHASE_ACTIVE:
      return BASE_ACTIVE_PROMPT
    case PHASE_CONSTRUCTIVE:
      return BASE_CONSTRUCTIVE_PROMPT
    case PHASE_INTERACTIVE:
      return BASE_INTERACTIVE_PROMPT
  }
}

export async function queryTutor(
  phase: ChatPhase,
  messages: ChatMessage[]
): Promise<string> {
  const filteredMessages = messages
    .filter(msg => msg.addToPrompt)
    .map(msg => createQueryMessage(msg.role, msg.text))

  const basePrompt = getBasePrompt(phase)

  const wrappedMessages = [
    createQueryMessage("system", basePrompt),
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
