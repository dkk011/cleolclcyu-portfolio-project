interface Career {
  period: string;
  company: string;
  position: string;
  description: string;
}

const careers: Career[] = [
  {
    period: '2026',
    company: '현대오토에버 모빌리티 SW 스쿨',
    position: '웹앱 4기',
    description:
      'React, TypeScript 기반 웹앱 개발 및 프로젝트 수행',
  },
];

export default function CareerSection() {
  return (
    <section id="career">
      <h2>CAREER</h2>

      <div>
        {careers.map((career) => (
          <article key={`${career.period}-${career.company}`}>
            <p>{career.period}</p>
            <p>{career.company}</p>
            <p>{career.position}</p>
            <p>{career.description}</p>
          </article>
        ))}
      </div>

    </section>
  );
}