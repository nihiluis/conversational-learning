import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { queryTutor } from "~/server/lib/openai"
import { ChatMessage } from "~/state"
import { getUserFromCtx } from "~/server/lib/user"
import { uuidv4 } from "~/constants/reexports"
import { hasUserServerOpenAiAccess } from "~/lib/user"
import { SITE_NAME } from "~/constants/env"

export const chatRouter = createTRPCRouter({
  resolveAnswer: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            id: z.string(),
            text: z.string(),
            role: z.enum(["user", "system", "assistant"]),
            addToPrompt: z.boolean(),
            showInUi: z.boolean(),
            error: z.string(),
            type: z.enum(["default", "error", "warning"]),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }): Promise<ChatMessage> => {
      const user = await getUserFromCtx(ctx)
      if (!user) {
        return {
          id: uuidv4(),
          text: `Unable to authenticate with ${SITE_NAME}. Are you logged in?`,
          error: "User not found.",
          addToPrompt: false,
          showInUi: true,
          role: "system",
          type: "error",
        }
      }

      if (!hasUserServerOpenAiAccess(user)) {
        return {
          id: uuidv4(),
          text: `You have no access to the ChatGPT API through ${SITE_NAME}. Please provide your own OpenAI access key in the settings`,
          error: "Unauthorized",
          addToPrompt: false,
          showInUi: true,
          role: "system",
          type: "error",
        }
      }

      const answer = await queryTutor(input.messages)

      return answer
    }),
})
