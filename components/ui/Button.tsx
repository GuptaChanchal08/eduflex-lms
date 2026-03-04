import React from "react";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="rounded-md bg-black px-4 py-2 text-white text-sm hover:bg-gray-800 disabled:opacity-50"
    >
      {children}
    </button>
  );
}