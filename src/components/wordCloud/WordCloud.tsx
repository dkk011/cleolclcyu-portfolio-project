import { useEffect, useState } from "react";
import type { Keyword } from "../../types/keyword.types";
import KeywordSelect from "./KeywordSelect";
import Chatbot from "./Chatbot";
import { getKeywords } from "../../api/keyword/getKeywords";

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
    <section id="wordcloud">
      <p>WORD CLOUD</p>
      <h2>저는 이런 사람입니다</h2>

      <KeywordSelect
        keywords={keywords}
        selectedKeyword={selectedKeyword?.keyword ?? null}
        onSelectKeyword={handleSelectKeyword}
      />

      <Chatbot
        selectedKeyword={selectedKeyword}
      />
    </section>
  );
}