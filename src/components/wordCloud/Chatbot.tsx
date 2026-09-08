import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '../../api/supabase';
import type { Keyword } from '../../types/keyword.types';
import styles from './wordcloud.module.css';
import { ArrowUpRight, CircleHelp, Sparkles } from 'lucide-react';

interface ChatbotProps {
  selectedKeyword: Keyword | null;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot({
  selectedKeyword,
}: ChatbotProps) {
  // 현재 입력창에 작성 중인 질문 저장
  const [question, setQuestion] = useState('');

  // 사용자 질문, AI 답변을 순서대로 저장
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 중복 답변 요청 방지
  const [isLoading, setIsLoading] = useState(false);

  // 비동기 요청 순서 기록해서 키워드 바꾸고 나서 이전 요청이 늦게 오는 경우 구분
  const requestIdRef = useRef(0);

  useEffect(() => {
    // 키워드 바뀌면 이전 대화 초기화
    setMessages([]);
    setQuestion('');
    setIsLoading(false);

    // 이전 요청이 늦게 도착해도 현재 키워드에 잘못된 답변이 추가되지 않도록 요청 번호 증가
    requestIdRef.current += 1;
  }, [selectedKeyword?.keyword]);

  // 질문을 받아 실제 AI 요청을 처리하는 함수
  // 입력창 질문과 추천 질문 모두 이 함수를 재사용한다
  const handleSubmit = async (
    submittedQuestion: string,
  ) => {
    // 선택된 키워드 없으면 질문 불가
    if (!selectedKeyword) {
      return;
    }

    const trimmedQuestion =
      submittedQuestion.trim();

    // 빈 질문이거나 이미 요청 중이면 새로 요청 안 보냄
    if (!trimmedQuestion || isLoading) {
      return;
    }

    // 현재 요청이 어떤 키워드에서 시작됐는지 확인하기 위한 요청 번호
    const currentRequestId = requestIdRef.current;

    // 요청 보낼 때 키워드 저장
    const currentKeyword = selectedKeyword.keyword;

    // 사용자가 입력한 질문을 대화에 추가
    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmedQuestion,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    // 질문 입력창 초기화
    setQuestion('');

    setIsLoading(true);

    try {
      // Supabase Edge Function으로 Groq 호출
      const { data, error } =
        await supabase.functions.invoke(
          'chat',
          {
            body: {
              keyword: currentKeyword,
              question: trimmedQuestion,
            },
          },
        );

      // 키워드 변경된 다음 이전 요청이 도착하면 현재 대화에는 결과를 반영하지 않는다
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (error) {
        console.error('Edge Function Error:', error );

        // HTTP 오류면 Edge Function에서 전달한 응답 내용 확인
        if (
          error instanceof FunctionsHttpError
        ) {
          const errorBody =
            await error.context
              .json()
              .catch(() => null);

          console.error('Edge Function Response:', errorBody);

          throw new Error(errorBody?.error ?? 'Edge Function에서 오류가 발생했습니다.');
        }

        throw new Error(error.message);
      }

      // 요청 성공하고 AI 답변 없는 경우
      if (!data?.answer) {
        throw new Error(
          'AI 답변이 없습니다.',
        );
      }

      // AI 답변을 대화에 추가
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
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

      console.error(
        'Chatbot Error:',
        error,
      );

      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content:
          error instanceof Error
            ? error.message
            : '답변을 가져오는 중 오류가 발생했습니다.',
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

  // 입력창에서 질문 전송할 때 호출
  const handleInputSubmit = () => {
    handleSubmit(question);
  };

  // 추천 질문을 클릭했을 때 호출
  const handleSuggestedQuestion = () => {
    if (!selectedKeyword) {
      return;
    }

    handleSubmit(selectedKeyword.question);
  };

  // Enter 키 눌렀을 때 질문 전송
  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault();
      handleInputSubmit();
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

        {/* 키워드 선택했을 때만 현재 선택된 키워드 보여주기 */}
        {selectedKeyword && (
          <div
            className={styles.selectedKeyword}
          >
            <span>KEYWORD</span>

            <strong>
              {selectedKeyword.keyword}
            </strong>
          </div>
        )}
      </div>

      <div className={styles.chatBody}>
        {/* 아직 키워드 선택하지 않은 상태 */}
        {!selectedKeyword ? (
          <div className={styles.chatEmpty}>
            <div
              className={
                styles.chatEmptyIcon
              }
            >
              <CircleHelp
                size={20}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <p>
              왼쪽에서 키워드를 선택하면
              <br />
              저에 대해 질문할 수 있어요.
            </p>
          </div>
        ) : messages.length === 0 ? (
          // 키워드는 선택했지만 아직 대화가 없는 상태
          <div className={styles.chatStart}>
            <div className={styles.chatEmpty}>
              <div
                className={
                  styles.chatEmptyIcon
                }
              >
                <Sparkles
                  size={20}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
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

            {/* 추천 질문 */}
            <div
              className={
                styles.suggestedQuestionArea
              }
            >
              <span
                className={
                  styles.suggestedQuestionLabel
                }
              >
                추천 질문
              </span>

              <button
                type="button"
                className={
                  styles.suggestedQuestion
                }
                onClick={
                  handleSuggestedQuestion
                }
                disabled={isLoading}
              >
                <span>
                  {selectedKeyword.question}
                </span>

                <ArrowUpRight
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        ) : (
          // 질문과 답변이 존재하는 상태
          <div className={styles.messages}>
            {/* 대화 배열 순회하면서 메시지 렌더링하고 role에 따라 다른 스타일 적용 */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === 'user'
                    ? styles.messageUser
                    : styles.messageAssistant
                }
              >
                <div
                  className={
                    styles.messageLabel
                  }
                >
                  {message.role === 'user'
                    ? 'YOU'
                    : 'AI'}
                </div>

                <div
                  className={
                    styles.messageBubble
                  }
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* AI 응답 대기 중에 로딩 메시지 보여주기 */}
            {isLoading && (
              <div
                className={
                  styles.messageAssistant
                }
              >
                <div
                  className={
                    styles.messageLabel
                  }
                >
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
              : '키워드를 먼저 선택해주세요.'
          }
          disabled={
            !selectedKeyword || isLoading
          }
        />

        <button
          type="button"
          onClick={handleInputSubmit}
          disabled={
            !selectedKeyword ||
            !question.trim() ||
            isLoading
          }
          aria-label="질문하기"
        >
          {isLoading ? (
            '...'
          ) : (
            <ArrowUpRight
              size={18}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </div>
  );
}