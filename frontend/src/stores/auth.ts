"use client"

import { defineStore } from "pinia"
import { ref, computed } from "vue"
import axios from "axios"
import { useToast } from "vue-toastification"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "client" | "plumber" | "admin"
  isVerified: boolean
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem("token"))
  const loading = ref(false)
  const toast = useToast()

  const isAuthenticated = computed(() => !!token.value)
  const isPlumber = computed(() => user.value?.role === "plumber")
  const isClient = computed(() => user.value?.role === "client")

  // Configuration axios
  if (token.value) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`
  }

  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      const response = await axios.post("/api/auth/login", { email, password })

      token.value = response.data.token
      user.value = response.data.user

      localStorage.setItem("token", response.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

      toast.success("Connexion réussie !")
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur de connexion")
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: any) => {
    try {
      loading.value = true
      const response = await axios.post("/api/auth/register", userData)

      token.value = response.data.token
      user.value = response.data.user

      localStorage.setItem("token", response.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

      toast.success("Inscription réussie ! Vérifiez votre email.")
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'inscription")
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    toast.info("Déconnexion réussie")
  }

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/auth/profile")
      user.value = response.data.user
    } catch (error) {
      logout()
    }
  }

  // Initialiser le profil si token existe
  if (token.value && !user.value) {
    fetchProfile()
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isPlumber,
    isClient,
    login,
    register,
    logout,
    fetchProfile,
  }
})
