import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import About from './components/about/About'
import WordCloud from './components/wordCloud/WordCloud'
import Career from './components/career/Career'
import Skill from './components/skill/Skill'
import Project from './components/project/Project'
import Activity from './components/activity/Activity'
import Blog from './components/blog/Blog'
import Closing from './components/closing/Closing'
import NavBar from './components/navBar/NavBar'
import styles from './styles/App.module.css'

function App() {
  const [_, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.app}>
      <NavBar />

      <main className={styles.main}>
        <About />
        <WordCloud />
        <Career />
        <Skill />
        <Project />
        <Activity />
        <Blog />
        <Closing />
      </main>

      <button
          type="button"
          onClick={scrollToTop}
          className={styles.scrollTopBtn}
          aria-label="맨 위로 이동"
        >
          <ArrowUp size={22} strokeWidth={2.5} />
        </button>
    </div>
  );
}

export default App