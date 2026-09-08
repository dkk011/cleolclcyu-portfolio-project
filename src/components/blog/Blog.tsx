import { useEffect, useState } from 'react';
import { getBlogs } from '../../api/blog/getBlogs';
import type { Blog as BlogType } from '../../types/blog.types';
import styles from './blog.module.css';

export default function Blog() {
  // Supabase에서 가져온 블로그 목록
  const [blogs, setBlogs] = useState<BlogType[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // 블로그 데이터 가져와서 state에 저장
        const data = await getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Blogs Error:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section id="blog" className={styles.blog}>
      <div className={styles.container}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>BLOG</p>

          <div className={styles.headingContent}>
            <h2 className={styles.title}>
              공부하고 기록한 글들
            </h2>
          </div>
        </header>

        <div className={styles.list}>
          {/* 블로그 배열을 순회하면서 블로그 항목 렌데링 */}
          {blogs.map((blog, index) => (
            <a
              key={blog.id}
              className={styles.item}
              href={blog.url}
              target="_blank"
              rel="noreferrer"
            >
              <div className={styles.number}>
                {/* index는 화면에 표시할 번호를 만드는 데 사용
                한 자리 숫자 앞에 0을 붙여 두 자리로 만듦 */}
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className={styles.content}>
                <div className={styles.meta}>
                  <span>{blog.source}</span>
                  <span>
                    {blog.date
                      .slice(0, 10)
                      .replaceAll('-', '.')}
                  </span>
                </div>

                <h3 className={styles.itemTitle}>
                  {blog.title}
                </h3>
                
                {/* description이 있을 때만 설명 표시 */}
                {blog.description && (
                  <p className={styles.itemDescription}>
                    {blog.description}
                  </p>
                )}
              </div>

              <span
                className={styles.arrow}
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
          ))}
        </div>

        {/* 블로그 목록이 비어 있을 때만 안내 문구 표시 */}
        {blogs.length === 0 && (
          <div className={styles.empty}>
            <p>작성한 글이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}