import { requestJson } from "./apiClient";

export type AssistantAnswer = {
  question: string;
  answer: string;
  sources: string[];
  session_id?: string | null;
};

export function askAssistant(question: string) {
  return requestJson<AssistantAnswer>("/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}
