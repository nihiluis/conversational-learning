import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { EduCourse, EduLecture } from "@prisma/client"

interface GetOnboardingResponse {
  courses: CourseWithLectures[]
}

export type CourseWithLectures = (EduCourse & {
  lectures: EduLecture[]
})

export const onboardingRouter = createTRPCRouter({
  getOnboarding: publicProcedure
    .input(z.object({}))
    .query(async ({ input, ctx }): Promise<GetOnboardingResponse> => {
      const courses = await ctx.prisma.eduCourse.findMany({
        include: { lectures: true },
      })

      return {
        courses,
      }
    }),
})
