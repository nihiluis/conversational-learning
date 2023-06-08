import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { EduCourse, EduLecture } from "@prisma/client"

interface GetLecturesResponse {
  courses: EduCourse[]
}

export const onboardingRouter = createTRPCRouter({
  getCourses: publicProcedure
    .input(z.object({}))
    .query(async ({ input, ctx }): Promise<GetLecturesResponse> => {
      const courses = await ctx.prisma.eduCourse.findMany()

      return {
        courses,
      }
    }),
})
