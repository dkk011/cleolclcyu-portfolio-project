import { useEffect, useState } from 'react';

import { getProfile } from '../../entities/profile/api/getProfile';
import type { Profile } from '../../entities/profile/model/types';

export default function ContactSection() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Profile Error:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <section>
      <h2>{profile.contact_title}</h2>

      {profile.contact_description && (
        <p>{profile.contact_description}</p>
      )}

      {profile.contact_button_url && (
        <a href={profile.contact_button_url}>
          {profile.contact_button_text}
        </a>
      )}
    </section>
  );
}