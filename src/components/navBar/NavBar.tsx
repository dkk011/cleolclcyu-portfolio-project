import styles from './navbar.module.css'

const menuItems = [
  { label: 'ABOUT', target: '#about' },
  { label: 'WORDCLOUD', target: '#wordcloud' },
  { label: 'CAREER', target: '#career' },
  { label: 'SKILL', target: '#skill' },
  { label: 'PROJECT', target: '#project' },
  { label: 'ACTIVITY', target: '#activity' },
  { label: 'BLOG', target: '#blog' },
  { label: 'CONTACT', target: '#closing' },
];

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <a className={styles.logo} href="#about">
          공덕규's Portfolio
        </a>

        <div className={styles.menu}>
          {menuItems.map((item) => (
            <a
              key={item.target}
              className={styles.menuItem}
              href={item.target}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}