"use client";

import React from "react";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        {...props}
        className="
          w-full
          rounded-md
          border
          border-gray-300
          px-3
          py-2
          text-gray-900
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-black
        "
      />
    </div>
  );
}