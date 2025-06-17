<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center">
          <WrenchScrewdriverIcon class="h-12 w-12 text-blue-600" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer votre compte
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            connectez-vous à votre compte existant
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <!-- Sélection du rôle -->
        <div>
          <label class="text-base font-medium text-gray-900">Je suis :</label>
          <div class="mt-4 space-y-4">
            <div class="flex items-center">
              <input
                id="client"
                v-model="form.role"
                name="role"
                type="radio"
                value="client"
                class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label for="client" class="ml-3 block text-sm font-medium text-gray-700">
                Un particulier cherchant un plombier
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="plumber"
                v-model="form.role"
                name="role"
                type="radio"
                value="plumber"
                class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label for="plumber" class="ml-3 block text-sm font-medium text-gray-700">
                Un plombier professionnel
              </label>
            </div>
          </div>
        </div>

        <div class="rounded-md shadow-sm space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="sr-only">Prénom</label>
              <input
                id="firstName"
                v-model="form.firstName"
                name="firstName"
                type="text"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Prénom"
              />
            </div>
            <div>
              <label for="lastName" class="sr-only">Nom</label>
              <input
                id="lastName"
                v-model="form.lastName"
                name="lastName"
                type="text"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nom"
              />
            </div>
          </div>
          
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Adresse email"
            />
          </div>
          
          <div>
            <label for="phone" class="sr-only">Téléphone</label>
            <input
              id="phone"
              v-model="form.phone"
              name="phone"
              type="tel"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Numéro de téléphone"
            />
          </div>
          
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Mot de passe (min. 6 caractères)"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="sr-only">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Confirmer le mot de passe"
            />
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            name="terms"
            type="checkbox"
            required
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            J'accepte les 
            <a href="#" class="text-blue-600 hover:text-blue-500">conditions d'utilisation</a>
            et la 
            <a href="#" class="text-blue-600 hover:text-blue-500">politique de confidentialité</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span v-if="authStore.loading">Création du compte...</span>
            <span v-else>Créer mon compte</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { WrenchScrewdriverIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: (route.query.role as string) || 'client',
  acceptTerms: false
})

const isFormValid = computed(() => {
  return form.value.firstName &&
         form.value.lastName &&
         form.value.email &&
         form.value.phone &&
         form.value.password.length >= 6 &&
         form.value.password === form.value.confirmPassword &&
         form.value.acceptTerms
})

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas')
    return
  }

  const userData = {
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    email: form.value.email,
    phone: form.value.phone,
    password: form.value.password,
    role: form.value.role
  }

  const success = await authStore.register(userData)
  if (success) {
    router.push('/dashboard')
  }
}
</script>
