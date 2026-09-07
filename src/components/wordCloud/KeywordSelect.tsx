import type { Keyword } from '../../types/keyword.types';
import styles from './wordcloud.module.css';

interface KeywordSelectProps {
  keywords: Keyword[];
  selectedKeyword: string | null;
  onSelectKeyword: (keyword: Keyword) => void;
}

const FLOATING_PRESETS = [
  { delay: '0s', duration: '5.4s', rot: '2deg' },
  { delay: '-1.8s', duration: '6.2s', rot: '-3deg' },
  { delay: '-3.2s', duration: '4.8s', rot: '1.5deg' },
  { delay: '-0.7s', duration: '5.8s', rot: '-2deg' },
  { delay: '-2.4s', duration: '6.6s', rot: '2.5deg' },
  { delay: '-4.1s', duration: '5.1s', rot: '-1.5deg' },
  { delay: '-1.2s', duration: '6.0s', rot: '3deg' },
  { delay: '-2.9s', duration: '5.6s', rot: '-2.5deg' },
];

export default function KeywordSelect({
  keywords,
  selectedKeyword,
  onSelectKeyword,
}: KeywordSelectProps) {
  return (
    <div className={styles.keywordCloud}>
      {keywords.map((keyword, index) => {
        const isSelected = selectedKeyword === keyword.keyword;
        const preset = FLOATING_PRESETS[index % FLOATING_PRESETS.length];

        return (
          <button
            key={keyword.keyword}
            type="button"
            className={`${styles.keyword} ${
              isSelected ? styles.keywordActive : ''
            }`}
            data-size={index % 3}
            style={
              {
                '--float-delay': preset.delay,
                '--float-duration': preset.duration,
                '--float-rot': preset.rot,
              } as React.CSSProperties
            }
            onClick={() => onSelectKeyword(keyword)}
          >
            <span className={styles.keywordInner}>
              {keyword.keyword}
              {isSelected && <span className={styles.activeDot} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}