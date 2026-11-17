import axios from "axios"
import { create } from "zustand"
import { checkMeApi, logoutApi, type AuthUser } from "../services/authApi"

type AuthStoreType = {
    user: AuthUser | null,
    loading: boolean,
    error: string | null,
    setAuth: (user: AuthUser | null) => void,
    checkAuth: () => Promise<void>,
    logout: () => Promise<void>,
}

const useAuthStore = create<AuthStoreType>((set) => ({
    user: null,
    loading: true,
    error: null,
    setAuth: (user) => set({ user, loading: false, error: null }),
    checkAuth: async () => {
        try {
            const res = await checkMeApi();
            set({ user: res.data.data, loading: false, error: null })
        } catch (error) {
            const isUnauthenticated = axios.isAxiosError(error) &&
                (error.response?.status === 401 || error.response?.status === 404);
            set({
                user: null,
                loading: false,
                error: isUnauthenticated ? null : error instanceof Error ? error.message : 'Could not verify your session',
            })
        }
    },
    logout: async () => {
        await logoutApi();
        set({ user: null, error: null })
    }
}))

export default useAuthStore;