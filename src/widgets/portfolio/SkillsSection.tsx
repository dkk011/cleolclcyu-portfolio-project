interface SkillGroup {
  category: string;
  skills: string[];
}

const skillGroups: SkillGroup[] = [
  {
    category: 'Frontend',
    skills: [
      'React',
      'JavaScript',
      'HTML',
      'CSS',
    ],
  },
  {
    category: 'State & Data',
    skills: [
      'Redux Toolkit',
      'React Query',
    ],
  },
  {
    category: 'Backend',
    skills: [
      'Node.js',
      'REST API',
      'MySQL',
    ],
  },
  {
    category: 'Cloud & BaaS',
    skills: [
      'Supabase',
      'AWS',
    ],
  },
  {
    category: 'Tools',
    skills: [
      'Git',
      'GitHub',
      'Figma',
    ],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills">
      <h2>SKILLS</h2>

      {skillGroups.map((group) => (
        <div key={group.category}>
          <h3>{group.category}</h3>

          <ul>
            {group.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}