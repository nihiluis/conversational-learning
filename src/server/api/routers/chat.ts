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
        messages: z.array(
          z.object({
            id: z.string(),
            text: z.string(),
            role: z.enum(["user", "system", "assistant"]),
            addToPrompt: z.boolean(),
          })
        ),
      })
    )
    .query(async ({ input }): Promise<ChatMessage> => {
      const [answer, err] = await protect(queryTutor(input.messages))

      if (err || !answer) {
        return {
          id: uuidv4(),
          text: "Unable to contact the Chat API. Try again at a later point.",
          addToPrompt: false,
          role: "assistant",
        }
      }

      return {
        id: uuidv4(),
        text: answer,
        role: "assistant",
        addToPrompt: true,
      }
    }),
})
