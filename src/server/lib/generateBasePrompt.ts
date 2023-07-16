import { EduCourse, EduLecture } from "@prisma/client"
import { BASE_PROMPT } from "~/constants/prompts"

interface GeneratePromptSystemConfiguration {
  lecture: EduLecture
  course: EduCourse
}

export function generateBasePrompt({
  lecture,
  course,
}: GeneratePromptSystemConfiguration): string {
  return `[system configuration]
    Course: ${course.title}
    Lecture: ${lecture.title}
    Learning goals: """${lecture.learningGoals}"""
    ${BASE_PROMPT}`
}
