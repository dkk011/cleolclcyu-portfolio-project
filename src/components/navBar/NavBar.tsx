import { useEffect, useState } from 'react';
import styles from './navbar.module.css';

const menuItems = [
  { label: 'ABOUT ME', target: 'aboutme' },
  { label: 'ASK ME', target: 'askme' },
  { label: 'CAREER', target: 'career' },
  { label: 'SKILL', target: 'skill' },
  { label: 'PROJECT', target: 'project' },
  { label: 'ACTIVITY', target: 'activity' },
  { label: 'BLOG', target: 'blog' },
  { label: 'CONTACT', target: 'closing' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('aboutme');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      let currentSection = 'aboutme';

      menuItems.forEach((item) => {
        const section = document.getElementById(item.target);

        if (!section) return;

        // 현재 스크롤 위치를 지나온 가장 마지막 section을 활성화
        if (section.offsetTop <= scrollPosition) {
          currentSection = item.target;
        }
      });

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <a className={styles.logo} href="#aboutme">
          공덕규's Portfolio
        </a>

        <div className={styles.menu}>
          {menuItems.map((item) => (
            <a
              key={item.target}
              href={`#${item.target}`}
              className={`${styles.menuItem} ${
                activeSection === item.target ? styles.active : ''
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}