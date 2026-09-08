import { useEffect, useState } from 'react';
import { getKeywords } from '../../api/keyword/getKeywords';
import type { Keyword } from '../../types/keyword.types';
import Chatbot from './Chatbot';
import KeywordSelect from './KeywordSelect';
import styles from './wordcloud.module.css';

export default function WordCloud() {
  // Supabase에서 가져온 전체 키워드 목록 저장
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  // 현재 선택한 키워드 저장
  const [selectedKeyword, setSelectedKeyword] =
    useState<Keyword | null>(null);

  useEffect(() => {
    // 비동기로 키워드 데이터 조회
    const fetchKeywords = async () => {
      try {
        // Supabase에서 키워드 목록 가져와서 저장
        const data = await getKeywords();
        setKeywords(data);
      } catch (error) {
        console.error('Keyword 조회 실패:', error);
      }
    };

    fetchKeywords();
  }, []);

  // 키워드 선택하면 상태로 저장하고 Chatbot에 전달
  const handleSelectKeyword = (keyword: Keyword) => {
    setSelectedKeyword(keyword);
  };

  return (
    <section
      id="askme"
      className={styles.wordcloud}
    >
      <div className={styles.container}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>ASK ME</p>

          <h2 className={styles.title}>
            키워드로 알아보는 나
          </h2>

          <p className={styles.description}>
            키워드를 선택하면 저에 대해 조금 더 자세히 알아볼 수 있습니다.
          </p>
        </header>

        <div className={styles.content}>
          <div className={styles.keywordArea}>
            {/* 키워드 목록, 선택 상태를 KeywordSelect에 전달 */}
            <KeywordSelect
              keywords={keywords}
              selectedKeyword={
                selectedKeyword?.keyword ?? null
              }
              onSelectKeyword={handleSelectKeyword}
            />
          </div>

          <div className={styles.chatArea}>
            {/* 선택된 키워드를 Chatbot에 전달 */}
            <Chatbot
              selectedKeyword={selectedKeyword}
            />
          </div>
        </div>
      </div>
    </section>
  );
}