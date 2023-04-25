import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import Chat from "~/components/chat"
import PageWrapper from "~/components/PageWrapper"
import { SITE_DESCRIPTION, SITE_NAME } from "~/constants/env"

import { api } from "~/utils/api"

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" })

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
          <div className="flex-grow">
            <Chat />
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default Home
