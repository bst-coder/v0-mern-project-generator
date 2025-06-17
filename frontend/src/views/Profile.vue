<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mon profil</h1>
        <p class="mt-2 text-gray-600">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Informations personnelles -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Informations personnelles</h2>
            </div>
            
            <form @submit.prevent="updateProfile" class="p-6 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    v-model="profileForm.firstName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    v-model="profileForm.lastName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p class="mt-1 text-sm text-gray-500">L'email ne peut pas être modifié</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900">Adresse</h3>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Rue</label>
                  <input
                    v-model="profileForm.address.street"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                    <input
                      v-model="profileForm.address.city"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                    <input
                      v-model="profileForm.address.zipCode"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ loading ? 'Mise à jour...' : 'Mettre à jour' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Photo de profil et actions -->
        <div class="space-y-6">
          <!-- Avatar -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Photo de profil</h3>
            <div class="flex flex-col items-center">
              <div class="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <img
                  v-if="user?.avatar"
                  :src="`/uploads/${user.avatar}`"
                  :alt="`${user.firstName} ${user.lastName}`"
                  class="h-24 w-24 rounded-full object-cover"
                />
                <UserCircleIcon v-else class="h-16 w-16 text-gray-400" />
              </div>
              
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="uploadAvatar"
                class="hidden"
              />
              
              <button
                @click="$refs.fileInput.click()"
                class="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Changer la photo
              </button>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Statistiques</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Membre depuis</span>
                <span class="text-sm font-medium">{{ formatDate(user?.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Rendez-vous</span>
                <span class="text-sm font-medium">{{ stats.totalAppointments }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Statut</span>
                <span :class="user?.isVerified ? 'text-green-600' : 'text-yellow-600'" class="text-sm font-medium">
                  {{ user?.isVerified ? 'Vérifié' : 'En attente' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions dangereuses -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Zone de danger</h3>
            <button
              @click="confirmDeleteAccount"
              class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4 text-red-600">Supprimer le compte</h3>
        <p class="text-gray-600 mb-6">
          Cette action est irréversible. Toutes vos données seront définitivement supprimées.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="deleteAccount"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { UserCircleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const user = computed(() => authStore.user)
const loading = ref(false)
const showDeleteModal = ref(false)

const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    zipCode: ''
  }
})

const stats = ref({
  totalAppointments: 0
})

const loadProfile = async () => {
  try {
    const response = await axios.get('/api/users/profile')
    const userData = response.data.user
    
    profileForm.value = {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: {
        street: userData.address?.street || '',
        city: userData.address?.city || '',
        zipCode: userData.address?.zipCode || ''
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error)
    toast.error('Erreur lors du chargement du profil')
  }
}

const updateProfile = async () => {
  try {
    loading.value = true
    await axios.put('/api/users/profile', profileForm.value)
    toast.success('Profil mis à jour avec succès')
    await authStore.fetchProfile()
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    toast.error('Erreur lors de la mise à jour du profil')
  } finally {
    loading.value = false
  }
}

const uploadAvatar = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('avatar', file)

  try {
    await axios.post('/api/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    toast.success('Photo de profil mise à jour')
    await authStore.fetchProfile()
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    toast.error('Erreur lors de la mise à jour de la photo')
  }
}

const confirmDeleteAccount = () => {
  showDeleteModal.value = true
}

const deleteAccount = async () => {
  try {
    await axios.delete('/api/users/account')
    toast.success('Compte supprimé avec succès')
    authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    toast.error('Erreur lors de la suppression du compte')
  }
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(() => {
  loadProfile()
})
</script>
