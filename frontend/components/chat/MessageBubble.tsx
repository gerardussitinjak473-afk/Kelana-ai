import AIContent from "@/components/AIContent";
import type { Message } from "@/types/conversation";
import { formatMessageTime } from "@/utils/formatDateTime";

type MessageBubbleProps = {
  message: Message;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      aria-label={`Pesan ${isUser ? "Anda" : "KelanaAI"}`}
    >
      <div
        className={`max-w-[88%] rounded-3xl px-4 py-3 shadow-sm sm:max-w-[76%] sm:px-5 ${
          isUser
            ? "rounded-br-md bg-pine text-white"
            : "rounded-bl-md border border-[#e5ded2] bg-white text-ink"
        } ${message.pending ? "opacity-75" : ""}`}
      >
        {isUser ? <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p> : <AIContent content={message.content} />}
        <time
          dateTime={message.created_at}
          className={`mt-1.5 block text-right text-[11px] font-semibold ${
            isUser ? "text-white/60" : "text-slate-400"
          }`}
        >
          {formatMessageTime(message.created_at)}
          {message.pending ? " · Mengirim" : ""}
        </time>
      </div>
    </article>
  );
}
