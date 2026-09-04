import { useEffect, useState } from "react";
import type { Keyword } from "../../types/keyword.types";
import KeywordSelect from "./KeywordSelect";
import Chatbot from "./Chatbot";
import { getKeywords } from "../../api/keyword/getKeywords";
import styles from "./wordcloud.module.css";

export default function WordCloud() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const data = await getKeywords();
        setKeywords(data);
      } catch (error) {
        console.error("Keyword 조회 실패:", error);
      }
    };

    fetchKeywords();
  }, []);

  const handleSelectKeyword = (keyword: Keyword) => {
    setSelectedKeyword(keyword);
  };

  return (
    <section id="wordcloud" className={styles.wordcloud}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>WORD CLOUD</p>
          <h2 className={styles.title}>
            저는 이런 사람입니다
          </h2>
          <p className={styles.description}>
            키워드를 선택하면 저에 대해 조금 더 자세히 알아볼 수 있습니다.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.keywordArea}>
            <KeywordSelect
              keywords={keywords}
              selectedKeyword={selectedKeyword?.keyword ?? null}
              onSelectKeyword={handleSelectKeyword}
            />
          </div>

          <div className={styles.chatArea}>
            <Chatbot selectedKeyword={selectedKeyword} />
          </div>
        </div>
      </div>
    </section>
  );
}