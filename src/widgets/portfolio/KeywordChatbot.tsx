import { useState } from 'react';
import type { Keyword } from '../../entities/keyword/model/types';
import { supabase } from '../../shared/api/supabase';

interface KeywordChatbotProps {
    selectedKeyword: Keyword | null;
}

export default function KeywordChatbot({
    selectedKeyword,
}: KeywordChatbotProps) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!selectedKeyword) {
            setAnswer('먼저 궁금한 키워드를 선택해주세요.');
            return;
        }

        if (!question.trim()) {
            setAnswer('질문을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setAnswer('답변을 생성 중입니다...');

        try {
            const { data, error } = await supabase.functions.invoke('chat', {
                body: {
                    keyword: selectedKeyword.keyword,
                    question: question.trim(),
                },
            });

            if (error) {
                console.error('Edge Function Error:', error);

                if ('context' in error && error.context) {
                    try {
                        const errorBody = await error.context.json();
                        console.error('Edge Function Response:', errorBody,);
                        throw new Error(errorBody?.error ?? 'Edge Function에서 오류가 발생했습니다.',);
                    } catch (contextError) {
                        console.error('Error Response Parse Error:', contextError,);
                    }
                } throw new Error(error.message);
            }

            if (!data?.answer) {
                throw new Error('AI 답변이 없습니다.');
            }

            setAnswer(data.answer);
        } catch (error) {
            console.error('Chatbot Error:', error);
            setAnswer(error instanceof Error ? error.message : '답변을 가져오는 중 오류가 발생했습니다.',);
        } finally { setIsLoading(false); }
    };

    return (
        <div>
            <h3>AI Chatbot</h3>

            {selectedKeyword ? (
                <p>
                    선택한 키워드: {selectedKeyword.keyword}
                </p>
            ) : (
                <p>키워드를 선택해주세요.</p>
            )}

            <input
                type="text"
                value={question}
                onChange={(event) => {
                    setQuestion(event.target.value);
                }}
                placeholder="궁금한 점을 질문해주세요."
                disabled={!selectedKeyword || isLoading}
            />

            <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedKeyword || isLoading}
            >
                {isLoading ? '답변 생성 중...' : '질문하기'}
            </button>

            {answer && (
                <div>
                    <h4>AI 답변</h4>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};