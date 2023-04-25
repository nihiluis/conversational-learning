import { PropsWithChildren } from "react"
import { RecoilRoot } from "recoil"

interface Props extends PropsWithChildren<{}> {}

export default function PageWrapper({ children }: Props) {
  return (
    <RecoilRoot>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {children}
      </main>
    </RecoilRoot>
  )
}
