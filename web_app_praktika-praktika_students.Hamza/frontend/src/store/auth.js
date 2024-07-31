import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

/*
    This store have all informations about the user.
    If the user is logged in, the user id, username and the E-Mail address.
*/
const useAuthStore = create((set, get) => ({
    allUserData: null, // Use this to store all user data
    loading: false,
    user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
        email: get().allUserData?.email || null
    }),
    setUser: (user) => set({ allUserData: user }),
    setLoading: (loading) => set({ loading }),
    isLoggedIn: () => get().allUserData !== null,
}));

if (import.meta.env.DEV) {
    mountStoreDevtool('Store', useAuthStore);
}

export { useAuthStore };