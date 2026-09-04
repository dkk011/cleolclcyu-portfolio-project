const menuItems = [
  { label: 'ABOUT', target: '#about' },
  { label: 'WORDCLOUD', target: '#wordcloud' },
  { label: 'CAREER', target: '#career' },
  { label: 'SKILL', target: '#skill' },
  { label: 'PROJECT', target: '#project' },
  { label: 'ACTIVITY', target: '#activity' },
  { label: 'BLOG', target: '#blog' },
];

export default function Navbar() {
  return (
    <nav>
      <p>PORTFOLIO</p>

      <div>
        {menuItems.map((item) => (
          <a key={item.target} href={item.target}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}