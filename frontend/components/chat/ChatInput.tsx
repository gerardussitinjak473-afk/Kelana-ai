"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import type { FormEvent, KeyboardEvent } from "react";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
};

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: ChatInputProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <form onSubmit={submit} className="border-t border-[#ded8cc] bg-white p-4 sm:p-5">
      <div className="flex items-end gap-3 rounded-2xl border border-[#ded8cc] bg-[#fdfbf7] p-2 focus-within:border-lagoon focus-within:ring-4 focus-within:ring-lagoon/10">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Tulis pesan</span>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={2}
            maxLength={20_000}
            placeholder={disabled ? "Tunggu jawaban KelanaAI..." : "Tulis pesan perjalananmu..."}
            className="max-h-36 min-h-12 w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-ink outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          />
        </label>
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-coral text-white transition hover:bg-[#c86445] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Kirim pesan"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-400">
        Enter untuk mengirim, Shift + Enter untuk baris baru
      </p>
    </form>
  );
}
