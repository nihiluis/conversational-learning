import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { queryTutor } from "~/server/lib/openai"
import { ChatMessage } from "~/state"
import { v4 as uuidv4 } from "uuid"
import protect from "await-protect"

export const chatRouter = createTRPCRouter({
  resolveAnswer: publicProcedure
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
            type: z.enum(["default", "error", "warning"]),
          })
        ),
      })
    )
    .mutation(async ({ input }): Promise<ChatMessage> => {
      const answer = await queryTutor(input.phase, input.messages)

      return {
        id: uuidv4(),
        text: answer,
        role: "assistant",
        error: "",
        addToPrompt: true,
        showInUi: true,
        type: "default",
      }
    }),
  resolveLocalAnswer: publicProcedure
    .input(
      z.object({
        phase: z.enum(["active", "constructive", "interactive"]),
        answer: z.string(),
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
    .mutation(async ({ input }): Promise<ChatMessage> => {
      return {
        id: uuidv4(),
        text: input.answer,
        role: "assistant",
        error: "",
        addToPrompt: true,
        showInUi: true,
        type: "default",
      }
    }),
})
