import { useEffect, useState } from 'react';
import { getBlogs } from '../../api/blog/getBlogs';
import type { Blog as BlogType } from '../../types/blog.types';
import styles from './blog.module.css';

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
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
          <p className={styles.eyebrow}>BLOGS</p>

          <div className={styles.headingContent}>
            <h2 className={styles.title}>
              공부하고 기록한 글들
            </h2>
          </div>
        </header>

        <div className={styles.list}>
          {blogs.map((blog, index) => (
            <a
              key={blog.id}
              className={styles.item}
              href={blog.url}
              target="_blank"
              rel="noreferrer"
            >
              <div className={styles.number}>
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

        {blogs.length === 0 && (
          <div className={styles.empty}>
            <p>작성한 글이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}