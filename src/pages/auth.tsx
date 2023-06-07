import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"
import PageWrapper from "~/components/PageWrapper"

export default function Auth({}) {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )

  return <PageWrapper></PageWrapper>
}
