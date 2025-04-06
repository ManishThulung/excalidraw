import { ButtonHTMLAttributes } from "react";

export const Button = ({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={"text-3xl bg-blue-500"} {...props}>
      {children}
    </button>
  );
};
