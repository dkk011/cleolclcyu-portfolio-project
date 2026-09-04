import { useEffect, useState } from 'react';

import { getSkills } from '../../api/skill/getSkills';
import type {
  Skill,
  SkillCategory,
} from '../../types/skill.types';

const categories: SkillCategory[] = [
  'Frontend',
  'Backend',
  'Data',
  'Tools',
];

export default function Skill() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (error) {
        console.error('Skills Error:', error);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section id="skill">
      <header>
        <h2>SKILLS</h2>
        <p>기술 스택</p>
      </header>

      {categories.map((category) => {
        const categorySkills = skills.filter(
          (skill) => skill.category === category,
        );

        if (categorySkills.length === 0) {
          return null;
        }

        return (
          <div key={category}>
            <h3>{category}</h3>

            <div>
              {categorySkills.map((skill) => (
                <article key={skill.id}>
                  <div>
                    <span aria-hidden="true">
                      {skill.icon}
                    </span>

                    <h4>{skill.name}</h4>
                  </div>

                  <p>{skill.description}</p>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}