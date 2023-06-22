import { signIn, signOut, useSession } from "next-auth/react"
import Button from "../ui/Button"
import classNames from "classnames"

interface Props {
  className?: string
}

export default function Sidebar({ className }: Props) {
  const { data: session } = useSession()

  return (
    <div className={classNames("bg-blue-900 p-4", className)}>
      {!session && <Button onClick={() => signIn()}>Sign in</Button>}
      {session && <Button onClick={() => signOut()}>Sign out</Button>}
    </div>
  )
}
