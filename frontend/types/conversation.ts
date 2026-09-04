export type MessageRole = "user" | "assistant";

export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: MessageRole;
  content: string;
  created_at: string;
  pending?: boolean;
}

export interface SendMessageResponse {
  conversation: Conversation;
  user_message: Message;
  assistant_message: Message;
}
