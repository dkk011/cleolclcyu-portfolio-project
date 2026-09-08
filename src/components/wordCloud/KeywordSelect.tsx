import type { Keyword } from '../../types/keyword.types';
import styles from './wordcloud.module.css';

interface KeywordSelectProps {
  keywords: Keyword[];
  selectedKeyword: string | null;
  onSelectKeyword: (keyword: Keyword) => void;
}

// 각 키워드가 조금씩 다르게 움지이도록 애니메이션 값 설정
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

        // 키워드 인덱스로 미리 정해둔 애니메이션 값 선택
        const preset = FLOATING_PRESETS[index % FLOATING_PRESETS.length];

        return (
          <button
            key={keyword.keyword}
            type="button"
            className={`${styles.keyword} ${
              // 선택된 키워드에만 active 스타일 추가
              isSelected ? styles.keywordActive : ''
            }`}
            // 인덱스에 따라 키워드 크기 스타일 다르게
            data-size={index % 3}
            style={
              {
                // CSS에서 사용할 애니메이션 값 전달
                '--float-delay': preset.delay,
                '--float-duration': preset.duration,
                '--float-rot': preset.rot,
              } as React.CSSProperties
            }
            onClick={() => onSelectKeyword(keyword)}
          >
            <span className={styles.keywordInner}>
              {keyword.keyword}
              {/* 현재 선택된 키워드일 때만 점 보여주기 */}
              {isSelected && <span className={styles.activeDot} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}