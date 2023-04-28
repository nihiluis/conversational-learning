import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { useRecoilState } from "recoil"
import Chat from "~/components/chat"
import HelpText from "~/components/HelpText"
import PageWrapper from "~/components/PageWrapper"
import ProcessSteps from "~/components/ProcessSteps"
import { CHATBOT_NAME, SITE_DESCRIPTION, SITE_NAME } from "~/constants/env"
import { ChatMessage, chatMessagesState, ChatPhase } from "~/state"

const Home: NextPage = () => {
  const [chatPhase, setChatPhase] = useState<ChatPhase>("active")
  const [chatMessages, setChatMessages] = useRecoilState(chatMessagesState)

  function setChatMessagesWrapper(phase: ChatPhase, messages: ChatMessage[]) {
    const newChatMessages = { ...chatMessages, [phase]: messages }
    setChatMessages(newChatMessages)
  }

  return (
    <>
      <Head>
        <title>{SITE_NAME}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageWrapper>
        <div className="flex gap-8 p-8">
          {/* <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/7KHdV6FSpo8"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen></iframe> */}
          <div className="mx-auto flex w-full flex-col gap-2 lg:max-w-4xl xl:max-w-6xl">
            <HelpText />
            <ProcessSteps phase={chatPhase} setPhase={setChatPhase} />
            <div className="flex-grow">
              {chatPhase === "active" && (
                <Chat
                  phase="active"
                  messages={chatMessages["active"]}
                  setMessages={setChatMessagesWrapper}
                />
              )}
              {chatPhase === "constructive" && (
                <Chat
                  phase="constructive"
                  messages={chatMessages["constructive"]}
                  setMessages={setChatMessagesWrapper}
                />
              )}
              {chatPhase === "interactive" && (
                <Chat
                  phase="interactive"
                  messages={chatMessages["interactive"]}
                  setMessages={setChatMessagesWrapper}
                />
              )}
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default Home
