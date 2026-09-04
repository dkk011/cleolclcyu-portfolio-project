import { useEffect, useState } from 'react';
import { getProfile } from '../../api/profile/getProfile';
import type { Profile } from '../../types/profile.types';
import styles from './closing.module.css';

export default function Closing() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Profile 불러오기 실패:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <section id="closing" className={styles.closing} />;
  }

  return (
    <section id="closing" className={styles.closing}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>CONTACT</p>

          <h2 className={styles.title}>
            {profile.contact_title}
          </h2>

          {profile.contact_description && (
            <p className={styles.description}>
              {profile.contact_description}
            </p>
          )}

          <div className={styles.actions}>
            {profile.contact_button_url && (
              <a
                className={styles.contactButton}
                href={`mailto:${profile.contact_button_url}`}
                target="_blank"
                rel="noreferrer"
              >
                <span>{profile.contact_button_text}</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <span>공덕규's Portfolio</span>

          <span>
            © {new Date().getFullYear()} Deokkyu Kong
          </span>
        </div>
      </div>
    </section>
  );
}