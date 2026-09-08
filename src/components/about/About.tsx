import { useEffect, useState } from "react";
import { getProfile } from "../../api/profile/getProfile";
import type { Profile } from "../../types/profile.types";
import styles from "./about.module.css";

export default function About() {
  // 프로필 데이터를 저장하고 처음에는 아직 데이터가 없는 상태
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Supabase에서 프로필 데이터 조회
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Profile 불러오기 실패:", error);
      }
    };

    fetchProfile();
  }, []);

  // 프로필 데이터를 가져오기 전에는 빈 섹션만 보여줌
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
            {/* profile.email이 있을 때만 Email 링크 렌더링, 이메일이 null이면 오른쪽 JSX도 렌더링 안 됨 */}
            {profile.email && (
              <a
                className={styles.link}
                href={`mailto:${profile.email}`}
              >
                <span>Email</span>
                <span>{profile.email}</span>
              </a>
            )}

            {/* GitHub 주소가 있을 때만 GitHub 링크 렌더링하고 DB에 URL이 없으면 링크 표시 안 됨 */}
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

        {/* 프로필 이미지가 등록되어 있을 때만 이미지 영역 표시 */}
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