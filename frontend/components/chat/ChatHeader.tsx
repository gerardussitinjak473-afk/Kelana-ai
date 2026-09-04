import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

type ChatHeaderProps = {
  title?: string | null;
};

export default function ChatHeader({ title }: ChatHeaderProps) {
  const displayTitle = title?.trim() || "New Conversation";

  return (
    <header className="flex items-center gap-3 border-b border-[#ded8cc] bg-white px-5 py-4 sm:px-6">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-50 text-pine">
        <ChatBubbleLeftRightIcon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-coral">
          Percakapan aktif
        </p>
        <h1 className="truncate text-lg font-extrabold text-ink" title={displayTitle}>
          {displayTitle}
        </h1>
      </div>
    </header>
  );
}
