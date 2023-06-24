import { Disclosure } from "@headlessui/react"
import { type NextPage } from "next"
import Head from "next/head"
import { HiChevronUp } from "react-icons/hi2"
import { useRecoilState } from "recoil"
import PageWrapper from "~/components/PageWrapper"
import { SITE_DESCRIPTION, SITE_NAME } from "~/constants/env"
import { api } from "~/utils/api"

interface FaqItem {
  title: string
  text: string
}

const generalFaqItems: FaqItem[] = [
  {
    title: "Who is this chatbot for?",
    text: "Missing.",
  },
  {
    title: "What algorithms are you using to power the chatbot?",
    text: "Missing.",
  },
]
const dataFaqItems: FaqItem[] = [
  {
    title: "What data is processed?",
    text: "All texts sent via this interface are processed by OpenAI for purposes according to their ToS. We use the texts to improve the capacity of the tool.",
  },
]

const Faq: NextPage = () => {
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
            <div className="mx-auto flex w-full flex-col gap-4 rounded-2xl bg-white p-4">
              <FaqItemsWrapper items={generalFaqItems} title="General" />
              <FaqItemsWrapper items={dataFaqItems} title="Data use" />
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

interface FaqItemsProps {
  items: FaqItem[]
  title: string
}

function FaqItemsWrapper({ items, title }: FaqItemsProps) {
  return (
    <div>
      <h4 className="text-xl">{title}</h4>
      <div className="divider mb-2 mt-0" />
      <div className="flex flex-col gap-2">
        {items.map((faqItem, idx) => (
          <FaqItem key={`faq-${title}-${idx}`} {...faqItem} />
        ))}
      </div>
    </div>
  )
}

function FaqItem({ title, text }: FaqItem) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
            <span>{title}</span>
            <HiChevronUp
              className={`${
                open ? "rotate-180 transform" : ""
              } h-5 w-5 text-purple-500`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="p-2 px-4 text-sm text-gray-500">
            {text}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Faq
