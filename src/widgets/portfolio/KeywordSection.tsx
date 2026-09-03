import { useEffect, useState } from "react";
import type { Keyword } from "../../entities/keyword/model/types";
import KeywordCloud from "./KeywordCloud";
import KeywordChatbot from "./KeywordChatbot";
import { getKeywords } from "../../entities/keyword/api/getKeywords";

export default function KeywordSection() {
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
    <section>
      <h2>ABOUT ME</h2>

      <KeywordCloud
        keywords={keywords}
        selectedKeyword={selectedKeyword?.keyword ?? null}
        onSelectKeyword={handleSelectKeyword}
      />

      <KeywordChatbot
        selectedKeyword={selectedKeyword}
      />
    </section>
  );
}