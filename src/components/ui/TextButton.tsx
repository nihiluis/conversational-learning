import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export default function TextButton({children, ...props}: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (<button className="hover:bg-blue-700 px-2 py-1 w-full transition rounded-lg flex gap-2 items-center" {...props}>{children}</button>)
}