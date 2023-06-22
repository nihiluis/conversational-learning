import { api } from "~/utils/api"
import { Fragment, useEffect, useState } from "react"
import { Combobox, Transition } from "@headlessui/react"
import { EduCourse, EduLecture } from "@prisma/client"
import { HiCheck, HiChevronUpDown } from "react-icons/hi2"
import OnboardingCombobox from "./OnboardingCombobox"
import { CourseWithLectures } from "~/server/api/routers/onboarding"
import OnboardingRow from "./OnboardingRow"
import { useRecoilState } from "recoil"
import { lectureState } from "~/state"

export default function Onboarding() {
  const getCoursesQuery = api.onboarding.getOnboarding.useQuery({})

  const courses = getCoursesQuery.data?.courses ?? []

  const [activeCourse, setActiveCourse] = useState<CourseWithLectures | null>(
    null
  )
  const [activeLecture, setActiveLecture] = useRecoilState(lectureState)

  const [possibleLectures, setPossibleLectures] = useState<EduLecture[]>([])

  useEffect(() => {
    const newPossibleLectures = activeCourse?.lectures ?? []
    setPossibleLectures(newPossibleLectures)

    if (activeLecture && activeLecture.courseId !== activeCourse?.id) {
      setActiveLecture(null)
    }
  }, [activeCourse])

  return (
    <div className="flex flex-col gap-4 w-full">
      <OnboardingRow title="Course">
        <OnboardingCombobox
          items={courses}
          setItem={setActiveCourse}
          activeItem={activeCourse}
          placeholder="Select course"
        />
      </OnboardingRow>
      {activeCourse && (
        <OnboardingRow title="Lecture">
          <OnboardingCombobox
            items={possibleLectures}
            setItem={setActiveLecture}
            activeItem={activeLecture}
            placeholder="Select your lecture"
          />
        </OnboardingRow>
      )}
    </div>
  )
}
