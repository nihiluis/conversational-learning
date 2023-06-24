import { EduUser } from "@prisma/client"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { getServerActionSession } from "~/server/serverUtils"

interface GetOrCreateUserResponse {
  user?: EduUser
  message: string
}

export const userRouter = createTRPCRouter({
  getOrCreateUser: publicProcedure.query(
    async ({ input, ctx }): Promise<GetOrCreateUserResponse> => {
      const mail = ctx.session?.user?.email

      if (!mail) {
        return {
            message: "Unable to retrieve session"
        }
      }

      const user = await ctx.prisma.eduUser.upsert({
        where: {
          mail,
        },
        update: {},
        create: {
          mail,
        },
      })

      return {
        user,
        message: "Upserted user data."
      }
    }
  ),
})
