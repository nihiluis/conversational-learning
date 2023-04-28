import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { queryTutor } from "~/server/lib/openai"
import { ChatMessage } from "~/state"
import { v4 as uuidv4 } from "uuid"
import protect from "await-protect"

export const chatRouter = createTRPCRouter({
  queryTutor: publicProcedure
    .input(
      z.object({
        phase: z.enum(["active", "constructive", "interactive"]),
        messages: z.array(
          z.object({
            id: z.string(),
            text: z.string(),
            role: z.enum(["user", "system", "assistant"]),
            addToPrompt: z.boolean(),
            showInUi: z.boolean(),
            error: z.string(),
          })
        ),
      })
    )
    .query(async ({ input }): Promise<ChatMessage> => {
      const [answer, err] = await protect(queryTutor(input.phase, input.messages))

      if (err || !answer) {
        return {
          id: uuidv4(),
          text: "Unable to contact the Chat API. Maybe you are going too fast? You can only send three requests per minute. Try again later.",
          error: err?.message ?? "",
          addToPrompt: false,
          role: "assistant",
          showInUi: true,
        }
      }

      return {
        id: uuidv4(),
        text: answer,
        role: "assistant",
        error: "",
        addToPrompt: true,
        showInUi: true,
      }
    }),
})
