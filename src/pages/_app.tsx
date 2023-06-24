import { AppProps, type AppType } from "next/app"

import { api } from "~/utils/api"

import "~/styles/globals.css"
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"
import { RecoilRoot } from "recoil"
import LocalStorageLoader from "~/components/LocalStorageLoader"
import AuthLoader from "~/components/AuthLoader"

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <LocalStorageLoader />
        <AuthLoader />
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  )
}

export default api.withTRPC(App)
