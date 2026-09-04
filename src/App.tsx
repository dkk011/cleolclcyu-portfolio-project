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
    </div>
  );
}

export default App