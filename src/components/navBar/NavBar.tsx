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

  // 모바일 메뉴가 열려 있는지 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // 모바일 메뉴에서 항목을 선택하면 메뉴를 닫음
  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <a className={styles.logo} href="#aboutme">
          공덕규's Portfolio
        </a>

        {/* 데스크톱 메뉴 */}
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

        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          className={`${styles.menuButton} ${
            isMenuOpen ? styles.menuButtonOpen : ''
          }`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={isMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* 모바일 메뉴 */}
      <div
        className={`${styles.mobileMenu} ${
          isMenuOpen ? styles.mobileMenuOpen : ''
        }`}
      >
        {menuItems.map((item) => (
          <a
            key={item.target}
            href={`#${item.target}`}
            className={`${styles.mobileMenuItem} ${
              activeSection === item.target ? styles.mobileActive : ''
            }`}
            onClick={handleMenuClick}
          >
            <span>{item.label}</span>

            {activeSection === item.target && (
              <span className={styles.mobileActiveDot} />
            )}
          </a>
        ))}
      </div>
    </nav>
  );
}