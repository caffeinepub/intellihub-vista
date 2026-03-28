import { useCallback, useEffect, useState } from "react";

export interface Profile {
  displayName: string;
  avatarBase64: string;
  onboardingDone: boolean;
  featuredToolId: number | null;
}

const DEFAULT_PROFILE: Profile = {
  displayName: "",
  avatarBase64: "",
  onboardingDone: false,
  featuredToolId: null,
};

function loadProfile(username: string, fallbackName: string): Profile {
  try {
    const raw = localStorage.getItem(`intellihub-profile-${username}`);
    if (!raw) return { ...DEFAULT_PROFILE, displayName: fallbackName };
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) } as Profile;
  } catch {
    return { ...DEFAULT_PROFILE, displayName: fallbackName };
  }
}

function saveProfile(username: string, profile: Profile) {
  localStorage.setItem(
    `intellihub-profile-${username}`,
    JSON.stringify(profile),
  );
}

export function useProfile(username: string, fallbackName = "") {
  const [profile, setProfile] = useState<Profile>(() =>
    loadProfile(username, fallbackName),
  );

  useEffect(() => {
    setProfile(loadProfile(username, fallbackName));
  }, [username, fallbackName]);

  const update = useCallback(
    (partial: Partial<Profile>) => {
      setProfile((prev) => {
        const next = { ...prev, ...partial };
        saveProfile(username, next);
        return next;
      });
    },
    [username],
  );

  const updateDisplayName = useCallback(
    (name: string) => update({ displayName: name }),
    [update],
  );
  const updateAvatar = useCallback(
    (base64: string) => update({ avatarBase64: base64 }),
    [update],
  );
  const markOnboardingDone = useCallback(
    () => update({ onboardingDone: true }),
    [update],
  );
  const setFeaturedTool = useCallback(
    (id: number | null) => update({ featuredToolId: id }),
    [update],
  );

  return {
    profile,
    updateDisplayName,
    updateAvatar,
    markOnboardingDone,
    setFeaturedTool,
  };
}
