import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Keyword } from "../../types/keyword.types";
import { supabase } from "../../api/supabase";
import { FunctionsHttpError } from "@supabase/supabase-js";
import styles from "./wordcloud.module.css";

interface ChatbotProps {
  selectedKeyword: Keyword | null;
}

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot({
  selectedKeyword,
}: ChatbotProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setMessages([]);
    setQuestion("");
    setIsLoading(false);
    requestIdRef.current += 1;
  }, [selectedKeyword?.keyword]);

  const handleSubmit = async () => {
    if (!selectedKeyword) {
      return;
    }

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) {
      return;
    }

    const currentRequestId = requestIdRef.current;
    const currentKeyword = selectedKeyword.keyword;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "chat",
        {
          body: {
            keyword: currentKeyword,
            question: trimmedQuestion,
          },
        },
      );

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (error) {
        console.error("Edge Function Error:", error);

        if (error instanceof FunctionsHttpError) {
          const errorBody = await error.context
            .json()
            .catch(() => null);

          console.error(
            "Edge Function Response:",
            errorBody,
          );

          throw new Error(
            errorBody?.error ??
            "Edge Function에서 오류가 발생했습니다.",
          );
        }

        throw new Error(error.message);
      }

      if (!data?.answer) {
        throw new Error("AI 답변이 없습니다.");
      }

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.answer,
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);
    } catch (error) {
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      console.error("Chatbot Error:", error);

      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "답변을 가져오는 중 오류가 발생했습니다.",
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === "Enter" &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.chatbot}>
      <div className={styles.chatHeader}>
        <div>
          <span className={styles.chatLabel}>
            AI CHAT
          </span>

          <h3 className={styles.chatTitle}>
            저에 대해 궁금한 점이 있나요?
          </h3>
        </div>

        {selectedKeyword && (
          <div className={styles.selectedKeyword}>
            <span>KEYWORD</span>

            <strong>
              {selectedKeyword.keyword}
            </strong>
          </div>
        )}
      </div>

      <div className={styles.chatBody}>
        {!selectedKeyword ? (
          <div className={styles.chatEmpty}>
            <div className={styles.chatEmptyIcon}>
              ?
            </div>

            <p>
              왼쪽에서 키워드를 선택하면
              <br />
              저에 대해 질문할 수 있어요.
            </p>
          </div>
        ) : messages.length === 0 ? (

          <div className={styles.chatEmpty}>
            <div className={styles.chatEmptyIcon}>
              ✦
            </div>

            <p>
              <strong>
                {selectedKeyword.keyword}
              </strong>
              에 대해
              <br />
              궁금한 점을 질문해보세요.
            </p>
          </div>
        ) : (

          <div className={styles.messages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? styles.messageUser
                    : styles.messageAssistant
                }
              >
                <div className={styles.messageLabel}>
                  {message.role === "user"
                    ? "YOU"
                    : "AI"}
                </div>

                <div className={styles.messageBubble}>
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div
                className={
                  styles.messageAssistant
                }
              >
                <div className={styles.messageLabel}>
                  AI
                </div>

                <div
                  className={`${styles.messageBubble} ${styles.loadingBubble}`}
                >
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.chatInput}>
        <input
          type="text"
          value={question}
          onChange={(event) => {
            setQuestion(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            selectedKeyword
              ? `${selectedKeyword.keyword}에 대해 질문해주세요.`
              : "키워드를 먼저 선택해주세요."
          }
          disabled={
            !selectedKeyword || isLoading
          }
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            !selectedKeyword ||
            !question.trim() ||
            isLoading
          }
          aria-label="질문하기"
        >
          {isLoading ? "..." : "↗"}
        </button>
      </div>
    </div>
  );
}