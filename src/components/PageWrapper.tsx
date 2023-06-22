import { PropsWithChildren } from "react"

interface Props extends PropsWithChildren<{}> {}

export default function PageWrapper({ children }: Props) {
  return (
      <main className="h-screen bg-gradient-to-b from-[#d6e4ff] to-[#f8faff]">
        {children}
      </main>
  )
}
