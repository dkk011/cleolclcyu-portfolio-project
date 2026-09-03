import { useEffect, useState } from 'react';

import { getBlogs } from '../../entities/blog/api/getBlogs';
import type { Blog } from '../../entities/blog/model/types';

export default function BlogsSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

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
    <section>
      <h2>BLOGS</h2>
      <p>공부하고 기록한 글들</p>

      <div>
        {blogs.map((blog) => (
          <a
            key={blog.id}
            href={blog.url}
            target="_blank"
            rel="noreferrer"
          >
            <div>
              <h3>{blog.title}</h3>

              {blog.description && (
                <p>{blog.description}</p>
              )}

              <small>
                {blog.source} ·{' '}
                {blog.date.slice(0, 10).replaceAll('-', '.')}
              </small>
            </div>

            <span aria-hidden="true">→</span>
          </a>
        ))}
      </div>
    </section>
  );
}