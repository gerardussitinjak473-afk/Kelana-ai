"use client";

import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ConversationSidebar from "@/components/chat/ConversationSidebar";
import MessageList from "@/components/chat/MessageList";
import UserMenu from "@/components/UserMenu";
import {
  createConversation,
  getConversationMessages,
  getConversations,
  sendConversationMessage,
} from "@/services/conversationService";
import type { Conversation, Message } from "@/types/conversation";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [error, setError] = useState("");

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  );

  useEffect(() => {
    let active = true;
    setIsLoadingConversations(true);
    getConversations()
      .then((items) => {
        if (!active) return;
        setConversations(items);
        if (items.length > 0) setIsLoadingMessages(true);
        setActiveConversationId((currentId) =>
          currentId && items.some((item) => item.id === currentId)
            ? currentId
            : items[0]?.id ?? null,
        );
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Riwayat percakapan gagal dimuat.",
          );
        }
      })
      .finally(() => active && setIsLoadingConversations(false));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      setIsLoadingMessages(false);
      return;
    }

    let active = true;
    setMessages([]);
    setError("");
    setIsLoadingMessages(true);
    getConversationMessages(activeConversationId)
      .then((items) => active && setMessages(items))
      .catch((requestError) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Pesan percakapan gagal dimuat.",
          );
        }
      })
      .finally(() => active && setIsLoadingMessages(false));

    return () => {
      active = false;
    };
  }, [activeConversationId]);

  function handleSelectConversation(conversationId: number) {
    if (conversationId === activeConversationId) return;
    setMessages([]);
    setError("");
    setIsLoadingMessages(true);
    setActiveConversationId(conversationId);
  }

  async function handleCreateConversation() {
    if (isCreatingConversation || isAssistantTyping) return;
    setIsCreatingConversation(true);
    setError("");
    try {
      const conversation = await createConversation();
      setConversations((current) => [conversation, ...current]);
      setMessages([]);
      setIsLoadingMessages(true);
      setActiveConversationId(conversation.id);
      setMessageInput("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Percakapan baru gagal dibuat.",
      );
    } finally {
      setIsCreatingConversation(false);
    }
  }

  async function handleSendMessage() {
    const content = messageInput.trim();
    const conversationId = activeConversationId;
    if (!content || !conversationId || isAssistantTyping) return;

    const optimisticMessage: Message = {
      id: -Date.now(),
      conversation_id: conversationId,
      role: "user",
      content,
      created_at: new Date().toISOString(),
      pending: true,
    };

    setError("");
    setMessageInput("");
    setMessages((current) => [...current, optimisticMessage]);
    setIsAssistantTyping(true);

    try {
      const result = await sendConversationMessage(conversationId, content);
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === result.conversation.id
            ? result.conversation
            : conversation,
        ),
      );
      setMessages((current) => [
        ...current.filter((message) => message.id !== optimisticMessage.id),
        result.user_message,
        result.assistant_message,
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Pesan gagal dikirim.",
      );

      try {
        const persistedMessages = await getConversationMessages(conversationId);
        setMessages(persistedMessages);
      } catch {
        setMessages((current) =>
          current.map((message) =>
            message.id === optimisticMessage.id
              ? { ...message, pending: false }
              : message,
          ),
        );
      }
    } finally {
      setIsAssistantTyping(false);
    }
  }

  const interactionLocked = isAssistantTyping || isCreatingConversation;

  return (
    <main className="min-h-screen bg-sand">
      <header className="border-b border-white/10 bg-ink text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-2 font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-coral text-white">
              <PaperAirplaneIcon className="h-5 w-5" />
            </span>
            Kelana<span className="-ml-2 text-teal-300">AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/trips"
              className="hidden items-center gap-2 text-sm font-bold text-white/75 transition hover:text-white sm:inline-flex"
            >
              <ArrowLeftIcon className="h-4 w-4" /> Trip History
            </Link>
            <UserMenu tone="dark" />
          </div>
        </div>
      </header>

      <section className="mx-auto h-[calc(100vh-73px)] min-h-[620px] max-w-7xl p-3 sm:p-5 lg:px-12 lg:py-6">
        <div className="grid h-full min-h-0 overflow-hidden rounded-[2rem] border border-[#ded8cc] bg-white shadow-float md:grid-cols-[280px_minmax(0,1fr)]">
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            isLoading={isLoadingConversations}
            disabled={interactionLocked}
            onSelect={handleSelectConversation}
            onCreate={handleCreateConversation}
          />

          <div className="flex min-h-0 min-w-0 flex-col">
            <ChatHeader title={activeConversation?.title} />

            {error && (
              <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700" role="alert">
                {error}
              </div>
            )}

            <MessageList
              conversationId={activeConversationId}
              messages={messages}
              isLoading={isLoadingMessages}
              isAssistantTyping={isAssistantTyping}
            />

            <ChatInput
              value={messageInput}
              onChange={setMessageInput}
              onSubmit={handleSendMessage}
              disabled={!activeConversationId || isLoadingMessages || interactionLocked}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
