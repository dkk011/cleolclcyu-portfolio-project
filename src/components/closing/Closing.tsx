import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getProfile } from '../../api/profile/getProfile';
import type { Profile } from '../../types/profile.types';
import styles from './closing.module.css';

export default function Closing() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error(
          'Profile 불러오기 실패:',
          error,
        );
      }
    };

    fetchProfile();
  }, []);

  // Profile 불러오기 전에는 빈 영역만 렌더링
  if (!profile) {
    return (
      <section
        id="closing"
        className={styles.closing}
      />
    );
  }

  return (
    <section
      id="closing"
      className={styles.closing}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>
            CONTACT
          </p>

          <h2 className={styles.title}>
            {profile.contact_title}
          </h2>

          {/* contact_description이 있을 때만 설명 영역 렌더링 */}
          {profile.contact_description && (
            <p className={styles.description}>
              {profile.contact_description}
            </p>
          )}

          <div className={styles.actions}>
            {/* 연락 버튼 url이 있을 때만 버튼 표시 */}
            {profile.contact_button_url && (
              <a
                className={styles.contactButton}
                href={profile.contact_button_url}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  {profile.contact_button_text}
                </span>

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </a>
            )}

            {/* email이 있을 때만 mailto 링크 표시 */}
            {profile.email && (
              <a
                className={styles.email}
                href={`mailto:${profile.email}`}
              >
                {profile.email}
              </a>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <span>
            공덕규's Portfolio
          </span>

          <span>
            © {new Date().getFullYear()} Deokkyu Kong
          </span>
        </div>
      </div>
    </section>
  );
}