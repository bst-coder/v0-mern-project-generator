<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Trouver un plombier</h1>
        <p class="mt-2 text-gray-600">
          {{ plumbers.length }} plombiers disponibles près de chez vous
        </p>
      </div>

      <!-- Filtres -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Service</label>
            <select
              v-model="filters.service"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              @change="searchPlumbers"
            >
              <option value="">Tous les services</option>
              <option value="plomberie-generale">Plomberie générale</option>
              <option value="chauffage">Chauffage</option>
              <option value="sanitaire">Sanitaire</option>
              <option value="depannage-urgence">Dépannage urgence</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ville</label>
            <input
              v-model="filters.location"
              type="text"
              placeholder="Votre ville"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              @input="searchPlumbers"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Note minimum</label>
            <select
              v-model="filters.minRating"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              @change="searchPlumbers"
            >
              <option value="">Toutes les notes</option>
              <option value="4">4+ étoiles</option>
              <option value="4.5">4.5+ étoiles</option>
            </select>
          </div>
          
          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des plombiers -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="plumber in plumbers"
          :key="plumber._id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          @click="viewPlumber(plumber._id)"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex items-center">
                <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <WrenchScrewdriverIcon class="h-6 w-6 text-blue-600" />
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ plumber.user.firstName }} {{ plumber.user.lastName }}
                  </h3>
                  <p class="text-sm text-gray-600">{{ plumber.businessName }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="flex items-center">
                  <StarIcon class="h-4 w-4 text-yellow-400 fill-current" />
                  <span class="ml-1 text-sm font-medium">{{ plumber.rating.average.toFixed(1) }}</span>
                  <span class="ml-1 text-sm text-gray-500">({{ plumber.rating.count }})</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ plumber.experience }} ans d'exp.</p>
              </div>
            </div>

            <div class="mt-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="specialty in plumber.specialties.slice(0, 3)"
                  :key="specialty"
                  class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {{ getSpecialtyName(specialty) }}
                </span>
                <span
                  v-if="plumber.specialties.length > 3"
                  class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  +{{ plumber.specialties.length - 3 }}
                </span>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center text-sm text-gray-600">
                <MapPinIcon class="h-4 w-4 mr-1" />
                <span>{{ plumber.serviceArea.cities.slice(0, 2).join(', ') }}</span>
                <span v-if="plumber.serviceArea.cities.length > 2">...</span>
              </div>
              <div class="text-lg font-semibold text-gray-900">
                {{ plumber.hourlyRate }}€/h
              </div>
            </div>

            <div class="mt-4">
              <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Voir le profil
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex space-x-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium',
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            ]"
          >
            {{ page }}
          </button>
        </nav>
      </div>

      <!-- État vide -->
      <div v-if="plumbers.length === 0 && !loading" class="text-center py-12">
        <WrenchScrewdriverIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun plombier trouvé</h3>
        <p class="mt-1 text-sm text-gray-500">
          Essayez de modifier vos critères de recherche.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  WrenchScrewdriverIcon,
  StarIcon,
  MapPinIcon
} from '@heroicons/vue/24/outline'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const plumbers = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)

const filters = ref({
  service: (route.query.service as string) || '',
  location: (route.query.location as string) || '',
  minRating: ''
})

const searchPlumbers = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams()
    
    if (filters.value.service) params.append('specialty', filters.value.service)
    if (filters.value.location) params.append('city', filters.value.location)
    if (filters.value.minRating) params.append('minRating', filters.value.minRating)
    params.append('page', currentPage.value.toString())
    
    const response = await axios.get(`/api/plumbers?${params}`)
    plumbers.value = response.data.plumbers
    totalPages.value = response.data.totalPages
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    service: '',
    location: '',
    minRating: ''
  }
  currentPage.value = 1
  searchPlumbers()
}

const changePage = (page: number) => {
  currentPage.value = page
  searchPlumbers()
}

const viewPlumber = (id: string) => {
  router.push(`/plumber/${id}`)
}

const getSpecialtyName = (specialty: string) => {
  const names = {
    'plomberie-generale': 'Plomberie générale',
    'chauffage': 'Chauffage',
    'sanitaire': 'Sanitaire',
    'depannage-urgence': 'Dépannage urgence',
    'installation-salle-bain': 'Salle de bain',
    'debouchage': 'Débouchage',
    'fuite-eau': 'Fuite d\'eau',
    'chauffe-eau': 'Chauffe-eau'
  }
  return names[specialty] || specialty
}

onMounted(() => {
  searchPlumbers()
})
</script>
