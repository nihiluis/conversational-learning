import { PropsWithChildren } from "react"
import Sidebar from "./sidebar/Sidebar"
import LocalStorageLoader from "./LocalStorageLoader"
import AuthLoader from "./AuthLoader"

interface Props extends PropsWithChildren<{}> {}

export default function PageWrapper({ children }: Props) {
  return (
    <main className="h-screen bg-gradient-to-b from-[#d6e4ff] to-[#f8faff]">
      <div className="relative flex h-full">
        <Sidebar className="h-full w-[260px]" />
        <div className="w-full">{children}</div>
      </div>
    </main>
  )
}
