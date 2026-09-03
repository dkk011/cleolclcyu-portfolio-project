import IntroSection from "../widgets/portfolio/IntroSection";
import KeywordSection from "../widgets/portfolio/KeywordSection";
import CareerSection from "../widgets/portfolio/CareerSection";
import SkillsSection from "../widgets/portfolio/SkillsSection";
import ProjectsSection from "../widgets/portfolio/ProjectsSection";
import ActivitiesSection from "../widgets/portfolio/ActivitiesSection";
import BlogsSection from "../widgets/portfolio/BlogsSection";
import ContactSection from "../widgets/portfolio/ContactSection";

export default function Portfolio() {
  return (
    <main>
      <IntroSection />
      <KeywordSection />
      <CareerSection />
      <SkillsSection />
      <ProjectsSection />
      <ActivitiesSection />
      <BlogsSection />
      <ContactSection />
    </main>
  );
}