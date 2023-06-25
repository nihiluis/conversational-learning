import { api } from "~/utils/api"
import { Fragment, useEffect, useState } from "react"
import { Combobox, Disclosure, Transition } from "@headlessui/react"
import { EduCourse, EduLecture } from "@prisma/client"
import { HiCheck, HiChevronDown, HiChevronUpDown } from "react-icons/hi2"
import OnboardingCombobox from "./OnboardingCombobox"
import { CourseWithLectures } from "~/server/api/routers/onboarding"
import OnboardingRow from "./OnboardingRow"
import { useRecoilState } from "recoil"
import { courseState, lectureState } from "~/state"
import { LoadingSpinnerText } from "../ui/LoadingSpinner"
import ErrorText from "../ui/ErrorText"

export default function Onboarding() {
  const getCoursesQuery = api.onboarding.getOnboarding.useQuery({})

  const courses = getCoursesQuery.data?.courses ?? []

  const [activeCourse, setActiveCourse] = useRecoilState(courseState)
  const [activeLecture, setActiveLecture] = useRecoilState(lectureState)

  const [possibleLectures, setPossibleLectures] = useState<EduLecture[]>([])

  useEffect(() => {
    const newPossibleLectures = activeCourse?.lectures ?? []
    setPossibleLectures(newPossibleLectures)

    if (activeLecture && activeLecture.courseId !== activeCourse?.id) {
      setActiveLecture(null)
    }
  }, [activeCourse])

  useEffect(() => {
    if (activeLecture && activeCourse?.id !== activeLecture.courseId) {
      const associatedCourse =
        courses.find(c => c.id === activeLecture.courseId) ?? null
      setActiveCourse(associatedCourse)
    }
  }, [activeLecture])

  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0">
            <Disclosure.Panel>
              <div className="bg-blue-50 p-6">
                <div className="mx-auto flex w-full flex-col gap-2 lg:max-w-4xl xl:max-w-6xl">
                  <div className="flex flex-col items-center justify-center">
                    {getCoursesQuery.isLoading && (
                      <LoadingSpinnerText text="Loading courses..." />
                    )}
                    {!getCoursesQuery.isLoading && getCoursesQuery.error && (
                      <ErrorText>
                        Unable to load courses due to an error.
                      </ErrorText>
                    )}
                    {!getCoursesQuery.isLoading &&
                      !getCoursesQuery.error &&
                      courses.length === 0 && (
                        <ErrorText>
                          No courses found. Something is wrong.
                        </ErrorText>
                      )}
                    {!getCoursesQuery.isLoading &&
                      !getCoursesQuery.error &&
                      courses.length > 0 && (
                        <OnboardingPanel
                          courses={courses}
                          possibleLectures={possibleLectures}
                        />
                      )}
                    {/* <div className="divider my-2 !bg-gray-50"></div> */}
                  </div>
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
          <div className="mb-4 flex flex-col items-center justify-center">
            <Disclosure.Button>
              <div className="flex flex-col items-center justify-center">
                <HiChevronDown size={24} className="cursor-pointer" />
                {open && <p className="text-xs">Hide onboarding</p>}
                {!open && <p className="text-xs">Show onboarding</p>}
              </div>
            </Disclosure.Button>
          </div>
        </>
      )}
    </Disclosure>
  )
}

interface PanelProps {
  possibleLectures: EduLecture[]
  courses: CourseWithLectures[]
}

function OnboardingPanel({ courses, possibleLectures }: PanelProps) {
  const [activeCourse, setActiveCourse] = useRecoilState(courseState)
  const [activeLecture, setActiveLecture] = useRecoilState(lectureState)

  return (
    <div className="flex w-full flex-col gap-4">
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
