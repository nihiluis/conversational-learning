import { AppProps, type AppType } from "next/app"

import { api } from "~/utils/api"

import "~/styles/globals.css"
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"
import { RecoilRoot } from "recoil"

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  )
}


export default api.withTRPC(App)
