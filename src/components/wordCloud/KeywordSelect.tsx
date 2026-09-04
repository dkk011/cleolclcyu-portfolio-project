import type { Keyword } from "../../types/keyword.types";
import styles from "./wordcloud.module.css";

interface KeywordSelectProps {
  keywords: Keyword[];
  selectedKeyword: string | null;
  onSelectKeyword: (keyword: Keyword) => void;
}

export default function KeywordSelect({
  keywords,
  selectedKeyword,
  onSelectKeyword,
}: KeywordSelectProps) {
  return (
    <div className={styles.keywordCloud}>
      {keywords.map((keyword, index) => (
        <button
          key={keyword.keyword}
          className={`${styles.keyword} ${
            selectedKeyword === keyword.keyword
              ? styles.keywordActive
              : ""
          }`}
          data-size={index % 3}
          onClick={() => onSelectKeyword(keyword)}
        >
          {keyword.keyword}
        </button>
      ))}
    </div>
  );
}