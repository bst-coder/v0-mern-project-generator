import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/auth/Login.vue"),
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("@/views/auth/Register.vue"),
    },
    {
      path: "/verify-email/:token",
      name: "VerifyEmail",
      component: () => import("@/views/auth/VerifyEmail.vue"),
    },
    {
      path: "/search",
      name: "PlumberSearch",
      component: () => import("@/views/PlumberSearch.vue"),
    },
    {
      path: "/plumber/:id",
      name: "PlumberProfile",
      component: () => import("@/views/PlumberProfile.vue"),
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/views/Dashboard.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/appointments",
      name: "Appointments",
      component: () => import("@/views/Appointments.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("@/views/Profile.vue"),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login")
  } else {
    next()
  }
})

export default router
