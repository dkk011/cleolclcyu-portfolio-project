import { useEffect, useState } from "react";
import { getProfile } from "../../api/profile/getProfile";
import type { Profile } from "../../types/profile.types";
import styles from "./about.module.css";

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Profile 불러오기 실패:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <section id="aboutme" className={styles.about} />;
  }

  return (
    <section id="aboutme" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.role}>{profile.role}</span>

          <h1 className={styles.title}>{profile.headline}</h1>

          <p className={styles.description}>{profile.description}</p>

          <div className={styles.links}>
            {profile.email && (
              <a
                className={styles.link}
                href={`mailto:${profile.email}`}
              >
                <span>Email</span>
                <span>{profile.email}</span>
              </a>
            )}

            {profile.github_url && (
              <a
                className={styles.link}
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
              >
                <span>GitHub</span>
                <span>↗</span>
              </a>
            )}

            {profile.velog_url && (
              <a
                className={styles.link}
                href={profile.velog_url}
                target="_blank"
                rel="noreferrer"
              >
                <span>Velog</span>
                <span>↗</span>
              </a>
            )}

            {profile.linkedin_url && (
              <a
                className={styles.link}
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
              >
                <span>LinkedIn</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>

        {profile.profile_image_url && (
          <div className={styles.profile}>
            <img
              className={styles.profileImage}
              src={profile.profile_image_url}
              alt="프로필 사진"
            />
          </div>
        )}
      </div>
    </section>
  );
}