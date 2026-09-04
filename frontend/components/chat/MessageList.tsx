"use client";

import { useEffect, useRef } from "react";

import MessageBubble from "@/components/chat/MessageBubble";
import type { Message } from "@/types/conversation";

type MessageListProps = {
  conversationId: number | null;
  messages: Message[];
  isLoading: boolean;
  isAssistantTyping: boolean;
};

export default function MessageList({
  conversationId,
  messages,
  isLoading,
  isAssistantTyping,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const previousConversationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading || !conversationId) return;

    const conversationChanged =
      previousConversationIdRef.current !== conversationId;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    messagesEndRef.current?.scrollIntoView({
      behavior: conversationChanged || reduceMotion ? "auto" : "smooth",
      block: "end",
    });
    previousConversationIdRef.current = conversationId;
  }, [conversationId, isAssistantTyping, isLoading, messages.length]);

  if (!conversationId) {
    return (
      <div className="grid flex-1 place-items-center p-8 text-center">
        <div>
          <p className="font-[var(--font-playfair)] text-3xl font-semibold text-ink">
            Mulai percakapan perjalananmu
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Buat percakapan baru untuk menyusun rencana dan melanjutkan pertanyaan
            tanpa mengulang konteks.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid flex-1 place-items-center text-sm font-semibold text-slate-500">
        Memuat percakapan...
      </div>
    );
  }

  return (
    <div
      className="flex-1 space-y-4 overflow-y-auto bg-[#fbf8f2] px-4 py-6 sm:px-6"
      aria-live="polite"
    >
      {messages.length === 0 && (
        <div className="mx-auto max-w-lg py-12 text-center">
          <p className="font-[var(--font-playfair)] text-2xl font-semibold text-ink">
            Apa rencana perjalananmu?
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Ceritakan tujuan, durasi, budget, atau gaya perjalanan yang kamu inginkan.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isAssistantTyping && (
        <div className="flex justify-start" role="status" aria-label="KelanaAI sedang mengetik">
          <div className="rounded-3xl rounded-bl-md border border-[#e5ded2] bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="mr-1 text-xs font-bold text-pine">KelanaAI mengetik</span>
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-lagoon motion-reduce:animate-none"
                  style={{ animationDelay: `${index * 120}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} aria-hidden="true" />
    </div>
  );
}
