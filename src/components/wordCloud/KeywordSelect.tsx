import type { Keyword } from '../../types/keyword.types';

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
        <div>
            <h3>Keywords</h3>

            <div>
                {keywords.map((item) => (
                    <button
                        key={item.keyword}
                        type="button"
                        onClick={() => onSelectKeyword(item)}
                        aria-pressed={selectedKeyword === item.keyword}
                    >
                        {item.keyword}
                    </button>
                ))}
            </div>
        </div>
    );
}