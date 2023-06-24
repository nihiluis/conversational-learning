import { signIn, signOut, useSession } from "next-auth/react"
import Button from "../ui/Button"
import classNames from "classnames"
import TextButton from "../ui/TextButton"
import {
  HiAcademicCap,
  HiCog6Tooth,
  HiQuestionMarkCircle,
} from "react-icons/hi2"
import Link from "next/link"

interface Props {
  className?: string
}

export default function Sidebar({ className }: Props) {
  const { data: session } = useSession()

  return (
    <div
      className={classNames(
        "flex flex-col bg-blue-900 p-4 text-white",
        className
      )}>
      <div className="flex flex-col">
        <Link href="/">
          <TextButton>
            <HiAcademicCap size={20} />
            <span>New chat</span>
          </TextButton>
        </Link>
      </div>
      <div className="divider my-2" />
      <div className="flex flex-col">
        <Link href="/faq">
          <TextButton>
            <HiQuestionMarkCircle size={20} />
            <span>FAQ</span>
          </TextButton>
        </Link>
        <Link href="/settings">
          <TextButton>
            <HiCog6Tooth size={20} />
            <span>Settings</span>
          </TextButton>
        </Link>
      </div>
      <div className="divider my-2" />
      <div className="flex flex-grow items-end justify-end">
        <div>
          {!session && (
            <TextButton onClick={() => signIn()}>Sign in</TextButton>
          )}
          {session && (
            <TextButton onClick={() => signOut()}>Sign out</TextButton>
          )}
        </div>
      </div>
    </div>
  )
}
