import { requestJson } from "@/services/apiClient";
import type {
  Conversation,
  Message,
  SendMessageResponse,
} from "@/types/conversation";

export function getConversations() {
  return requestJson<Conversation[]>("/conversations", {}, { auth: true });
}

export function createConversation(title?: string) {
  return requestJson<Conversation>(
    "/conversations",
    {
      method: "POST",
      body: JSON.stringify(title ? { title } : {}),
    },
    { auth: true },
  );
}

export function getConversationMessages(conversationId: number) {
  return requestJson<Message[]>(
    `/conversations/${conversationId}/messages`,
    {},
    { auth: true },
  );
}

export function sendConversationMessage(
  conversationId: number,
  content: string,
) {
  return requestJson<SendMessageResponse>(
    `/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    },
    { auth: true },
  );
}
