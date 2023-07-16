import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { HiChevronDown } from "react-icons/hi2"
import { useRecoilState } from "recoil"
import AuthLoader from "~/components/AuthLoader"
import Chat from "~/components/chat"
import HelpText from "~/components/HelpText"
import Onboarding from "~/components/onboarding/Onboarding"
import PageWrapper from "~/components/PageWrapper"
import ProcessSteps from "~/components/ProcessSteps"
import { isDevelopmentMode, SITE_DESCRIPTION, SITE_NAME } from "~/constants/env"
import { chatMessagesState } from "~/state"

const Home: NextPage = () => {
  const [chatMessages, setChatMessages] = useRecoilState(chatMessagesState)

  return (
    <>
      <Head>
        <title>{SITE_NAME}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageWrapper>
        {/* <div className="">
          <AuthBar />
        </div> */}

        {/* <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/7KHdV6FSpo8"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen></iframe> */}
        <Onboarding />
        <div className="mx-auto flex w-full flex-col gap-2 lg:max-w-4xl xl:max-w-6xl">
          {!isDevelopmentMode() && <HelpText />}
          {/* <ProcessSteps phase={currentPhase} setPhase={setCurrentPhase} /> */}
          <div className="flex-grow">
            <Chat
              messages={chatMessages}
              setMessages={setChatMessages}
            />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default Home
