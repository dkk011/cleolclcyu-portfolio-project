import { useEffect, useState } from 'react';

import { getCareers } from '../../entities/career/api/getCareers';
import type { Career } from '../../entities/career/model/types';

export default function CareerSection() {
  const [careers, setCareers] = useState<Career[]>([]);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const data = await getCareers();
        setCareers(data);
      } catch (error) {
        console.error('Career 불러오기 실패:', error);
      }
    };

    fetchCareers();
  }, []);

  return (
    <section id="career">
      <p>CAREER</p>
      <h2>지금까지의 여정</h2>

      <div>
        {careers.map((career) => (
          <article key={career.id}>
            <time dateTime={career.start_date}>
              {career.start_date.slice(0, 7).replace('-', '.')}
            </time>

            <h3>{career.title}</h3>

            <p>{career.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}