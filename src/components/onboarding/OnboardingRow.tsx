import { PropsWithChildren } from "react"

interface Props extends PropsWithChildren<{}> {
  title: string
}

export default function OnboardingRow({ title, children }: Props) {
  return (
    <div className="flex gap-2 items-center w-full">
      <h4 className="w-16">{title}</h4>
      <div className="flex-grow">{children}</div>
    </div>
  )
}
