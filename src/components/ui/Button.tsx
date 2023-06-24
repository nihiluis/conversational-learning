import classNames from "classnames"
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

export default function Button({
  children,
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      className={classNames(
        "rounded-xl bg-blue-500 px-3 py-3 text-white transition hover:bg-blue-700",
        className
      )}
      {...props}>
      {children}
    </button>
  )
}
