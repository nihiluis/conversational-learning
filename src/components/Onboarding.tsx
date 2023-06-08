import { Formik, Field, Form } from "formik"
import { api } from "~/utils/api"
import { Fragment, useEffect, useState } from "react"
import { Combobox, Transition } from "@headlessui/react"
import { EduCourse } from "@prisma/client"
import { HiCheck, HiChevronUpDown } from "react-icons/hi2"

export default function Onboarding() {
  const getCoursesQuery = api.onboarding.getCourses.useQuery({})

  const [courseSearchQuery, setCourseSearchQuery] = useState<string>("")

  const courses = getCoursesQuery.data?.courses ?? []

  return (
    <Formik
      initialValues={{
        organization: "",
        subject: "",
        course: "",
        lecture: "",
      }}
      onSubmit={async values => {
        await new Promise(r => setTimeout(r, 500))
        alert(JSON.stringify(values, null, 2))
      }}>
      {({ values, setFieldValue }) => (
        <Form>
          <Combobox
            onChange={option => setFieldValue("course", option)}
            value={values["course"]}>
            <div className="relative mt-1">
              <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox.Input
                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                  onChange={event => setCourseSearchQuery(event.target.value)}
                  displayValue={course => (course as EduCourse).title}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronUpDown
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setCourseSearchQuery("")}>
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {courses.length === 0 && courseSearchQuery !== "" ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    courses.map(course => (
                      <Combobox.Option
                        key={course.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-teal-600 text-white" : "text-gray-900"
                          }`
                        }
                        value={course}>
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}>
                              {course.title}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-white" : "text-teal-600"
                                }`}>
                                <HiCheck
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </Form>
      )}
    </Formik>
  )
}
