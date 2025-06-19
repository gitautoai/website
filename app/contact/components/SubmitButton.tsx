"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`py-3 px-8 rounded-lg font-medium text-white transition-colors ${
        pending ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
      }`}
    >
      {pending ? "Sending..." : "Send Message"}
    </button>
  );
}
