import { useEffect, useState } from "react";
import { getProfile } from "../../api/profile/getProfile";
import type { Profile } from "../../types/profile.types";

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
    return <section id="about">프로필을 불러오는 중입니다.</section>;
  }

  return (
    <section id="about">
      <span>{profile.role}</span>

      <h1>{profile.headline}</h1>

      <p>{profile.description}</p>

      <div>
        {profile.email && (
          <a href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        )}

        {profile.github_url && (
          <a href={profile.github_url} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}

        {profile.velog_url && (
          <a href={profile.velog_url} target="_blank" rel="noreferrer">
            Velog
          </a>
        )}

        {profile.linkedin_url && (
          <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
      </div>

      {profile.profile_image_url && (
        <img
          src={profile.profile_image_url}
          alt="프로필 사진"
        />
      )}
    </section>
  );
}