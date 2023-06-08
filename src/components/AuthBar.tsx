import { signIn, signOut, useSession } from "next-auth/react"
import Button from "./ui/Button"

export default function AuthBar() {
  const { data: session } = useSession()
  return (
    <div className="p-2 flex justify-end">
      {!session && <Button onClick={() => signIn()}>Sign in</Button>}
      {session && <Button onClick={() => signOut()}>Sign out</Button>}
    </div>
  )
}
