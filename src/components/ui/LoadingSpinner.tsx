import classNames from "classnames"
import { PropsWithChildren } from "react"
import { FiLoader } from "react-icons/fi"

export default function LoadingSpinner() {
  return <FiLoader className="animate-spin" />
}

export function LoadingSpinnerText({
  children,
  text,
  className,
}: PropsWithChildren<{ text?: string; className?: string }>) {
  return (
    <div
      className={classNames(
        "flex items-center justify-center gap-2",
        className
      )}>
      <LoadingSpinner />
      {text && <p>{text}</p>}
      {!text && children}
    </div>
  )
}
