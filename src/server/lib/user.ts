import { EduUser } from "@prisma/client"
import { ServerContext } from "../api/trpc"

export async function getUserFromCtx(
  ctx: ServerContext
): Promise<EduUser | null> {
  const mail = ctx.session?.user?.email

  if (!mail) {
    return null
  }

  const userData = await ctx.prisma.eduUser.findFirst({ where: { mail } })

  return userData
}
