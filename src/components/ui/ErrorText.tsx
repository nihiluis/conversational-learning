import classNames from "classnames"
import { PropsWithChildren } from "react"
import { HiOutlineXMark } from "react-icons/hi2"

export default function ErrorText({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={classNames(
        "flex items-center justify-center gap-2",
        className
      )}>
      <HiOutlineXMark className="text-red-600" />
      <p>{children}</p>
    </div>
  )
}
