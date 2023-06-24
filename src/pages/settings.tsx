import { Disclosure } from "@headlessui/react"
import { type NextPage } from "next"
import Head from "next/head"
import { HiChevronUp } from "react-icons/hi2"
import { useRecoilState } from "recoil"
import PageWrapper from "~/components/PageWrapper"
import { SITE_DESCRIPTION, SITE_NAME } from "~/constants/env"
import { api } from "~/utils/api"
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from "formik"
import { Settings, localStorageLoaded, settingsSelector } from "~/state"
import Button from "~/components/ui/Button"
import Link from "next/link"
import { OPENAI_ACCESS_KEY_CREATE_LINK } from "~/constants/openai"

type FormProps = Settings

const Settings: NextPage = () => {
  const [settings, setSettings] = useRecoilState(settingsSelector)
  const [isLocalStorageLoaded] = useRecoilState(localStorageLoaded)

  return (
    <>
      <Head>
        <title>{SITE_NAME}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageWrapper>
        <div className="mx-auto flex w-full flex-col gap-2 pt-8 lg:max-w-4xl xl:max-w-6xl">
          <div className="w-full">
            <div className="mx-auto flex w-full flex-col rounded-xl bg-white p-4">
              <h1 className="text-xl">Settings</h1>
              <div className="divider my-0" />
              {isLocalStorageLoaded && (
                <Formik<FormProps>
                  initialValues={settings}
                  onSubmit={(values, actions) => {
                    setSettings(values)
                  }}>
                  {({ values }) => (
                    <Form
                      className="flex flex-col gap-8"
                      onBlur={() => {
                        setSettings(values)
                      }}>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="openAiAccessKey" className="text-lg">
                          OpenAI Access Key
                        </label>
                        <p className="text-xs">
                          Access Keys can be created on{" "}
                          <Link
                            href={OPENAI_ACCESS_KEY_CREATE_LINK}
                            className="text-blue-600 transition hover:text-blue-800">
                            this page
                          </Link>
                          .
                        </p>
                        <Field
                          id="openAiAccessKey"
                          name="openAiAccessKey"
                          placeholder="The OpenAI Access Key"
                          className="input-bordered input w-full"
                        />
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default Settings
