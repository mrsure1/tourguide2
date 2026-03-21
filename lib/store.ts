import { create } from 'zustand';

interface UserProfileStore {
    isOnboardingComplete: boolean;
    completeOnboarding: () => void;
    resetProfile: () => void;
}

export const useUserProfileStore = create<UserProfileStore>((set) => ({
    isOnboardingComplete: false,

    completeOnboarding: () => set({ isOnboardingComplete: true }),

    resetProfile: () =>
        set({
            isOnboardingComplete: false,
        }),
}));

