// @/Components/ui/textarea.jsx

import React from "react";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={`w-full rounded-nonemd border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7f7f] ${className}`}
      {...props}
    />
  );
}
