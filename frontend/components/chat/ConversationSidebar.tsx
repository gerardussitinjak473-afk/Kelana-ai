import { PlusIcon } from "@heroicons/react/24/outline";

import type { Conversation } from "@/types/conversation";
import { formatConversationDate } from "@/utils/formatDateTime";

type ConversationSidebarProps = {
  conversations: Conversation[];
  activeConversationId: number | null;
  isLoading: boolean;
  disabled: boolean;
  onSelect: (conversationId: number) => void;
  onCreate: () => void;
};

export default function ConversationSidebar({
  conversations,
  activeConversationId,
  isLoading,
  disabled,
  onSelect,
  onCreate,
}: ConversationSidebarProps) {
  return (
    <aside className="flex min-h-0 flex-col border-b border-[#ded8cc] bg-white md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-3 border-b border-[#ded8cc] px-4 py-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-coral">
            Riwayat
          </p>
          <h2 className="font-extrabold text-ink">Percakapan</h2>
        </div>
        <button
          onClick={onCreate}
          disabled={disabled}
          className="grid h-10 w-10 place-items-center rounded-full bg-pine text-white transition hover:bg-lagoon disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Buat percakapan baru"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto p-3 md:flex-1 md:flex-col md:overflow-y-auto">
        {isLoading ? (
          <p className="p-3 text-sm text-slate-500">Memuat riwayat...</p>
        ) : conversations.length === 0 ? (
          <p className="p-3 text-sm leading-6 text-slate-500">
            Belum ada percakapan. Tekan tombol tambah untuk memulai.
          </p>
        ) : (
          conversations.map((conversation) => {
            const active = conversation.id === activeConversationId;
            const title = conversation.title?.trim() || "New Conversation";
            return (
              <button
                key={conversation.id}
                onClick={() => onSelect(conversation.id)}
                disabled={disabled}
                className={`min-w-56 rounded-2xl px-4 py-3 text-left transition md:min-w-0 ${
                  active
                    ? "bg-teal-50 text-pine ring-1 ring-teal-100"
                    : "text-ink hover:bg-sand"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <span className="block truncate text-sm font-extrabold">{title}</span>
                <span className="mt-1 block text-[11px] font-semibold text-slate-400">
                  {formatConversationDate(conversation.created_at)}
                </span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
