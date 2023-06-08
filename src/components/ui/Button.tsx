import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export default function Button({children, ...props}: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (<button className="px-1 py-1 bg-blue-500 hover:bg-blue-700 transition rounded text-white" {...props}>{children}</button>)
}