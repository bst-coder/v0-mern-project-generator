<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
        <p class="mt-2 text-gray-600">
          Gérez vos demandes d'intervention
        </p>
      </div>

      <!-- Filtres -->
      <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="flex flex-wrap gap-4">
          <button
            v-for="status in statusFilters"
            :key="status.value"
            @click="filterByStatus(status.value)"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              selectedStatus === status.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ status.label }}
          </button>
        </div>
      </div>

      <!-- Liste des rendez-vous -->
      <div class="space-y-6">
        <div
          v-for="appointment in appointments"
          :key="appointment._id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <WrenchScrewdriverIcon class="h-6 w-6 text-blue-600" />
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-semibold text-gray-900">
                      {{ appointment.service }}
                    </h3>
                    <p class="text-sm text-gray-600">
                      {{ appointment.plumber.user.firstName }} {{ appointment.plumber.user.lastName }}
                    </p>
                  </div>
                </div>

                <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div class="flex items-center text-sm text-gray-600 mb-2">
                      <CalendarIcon class="h-4 w-4 mr-2" />
                      {{ formatDate(appointment.scheduledDate) }}
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                      <MapPinIcon class="h-4 w-4 mr-2" />
                      {{ appointment.address.street }}, {{ appointment.address.city }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-600 mb-2">
                      <strong>Description:</strong> {{ appointment.description }}
                    </div>
                    <div v-if="appointment.estimatedPrice" class="text-sm text-gray-600">
                      <strong>Prix estimé:</strong> {{ formatPrice(appointment.estimatedPrice) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="ml-6 flex flex-col items-end">
                <span :class="getStatusClass(appointment.status)" class="px-3 py-1 text-sm font-medium rounded-full mb-4">
                  {{ getStatusText(appointment.status) }}
                </span>

                <div class="flex space-x-2">
                  <button
                    v-if="appointment.status === 'pending'"
                    @click="cancelAppointment(appointment._id)"
                    class="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    Annuler
                  </button>
                  
                  <button
                    v-if="appointment.status === 'completed' && !appointment.review"
                    @click="openReviewModal(appointment)"
                    class="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
                  >
                    Laisser un avis
                  </button>
                  
                  <button
                    @click="viewDetails(appointment._id)"
                    class="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Détails
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-if="appointments.length === 0 && !loading" class="text-center py-12">
        <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun rendez-vous</h3>
        <p class="mt-1 text-sm text-gray-500">
          Vous n'avez pas encore de rendez-vous programmé.
        </p>
        <div class="mt-6">
          <router-link
            to="/search"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Trouver un plombier
          </router-link>
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
    </div>

    <!-- Modal d'avis -->
    <div v-if="showReviewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Laisser un avis</h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Note</label>
          <div class="flex space-x-1">
            <button
              v-for="star in 5"
              :key="star"
              @click="reviewForm.rating = star"
              :class="[
                'h-8 w-8',
                star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
              ]"
            >
              <StarIcon class="h-full w-full fill-current" />
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
          <textarea
            v-model="reviewForm.comment"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Partagez votre expérience..."
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="closeReviewModal"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="submitReview"
            :disabled="!reviewForm.rating || !reviewForm.comment"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Publier l'avis
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  WrenchScrewdriverIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const appointments = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const selectedStatus = ref('')

const showReviewModal = ref(false)
const selectedAppointment = ref(null)
const reviewForm = ref({
  rating: 0,
  comment: ''
})

const statusFilters = [
  { value: '', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmés' },
  { value: 'in-progress', label: 'En cours' },
  { value: 'completed', label: 'Terminés' },
  { value: 'cancelled', label: 'Annulés' }
]

const fetchAppointments = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams()
    
    if (selectedStatus.value) params.append('status', selectedStatus.value)
    params.append('page', currentPage.value.toString())
    
    const response = await axios.get(`/api/appointments?${params}`)
    appointments.value = response.data.appointments
    totalPages.value = response.data.totalPages
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    toast.error('Erreur lors du chargement des rendez-vous')
  } finally {
    loading.value = false
  }
}

const filterByStatus = (status: string) => {
  selectedStatus.value = status
  currentPage.value = 1
  fetchAppointments()
}

const changePage = (page: number) => {
  currentPage.value = page
  fetchAppointments()
}

const cancelAppointment = async (appointmentId: string) => {
  if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return
  
  try {
    await axios.delete(`/api/appointments/${appointmentId}`)
    toast.success('Rendez-vous annulé avec succès')
    fetchAppointments()
  } catch (error) {
    console.error('Erreur lors de l\'annulation:', error)
    toast.error('Erreur lors de l\'annulation')
  }
}

const openReviewModal = (appointment: any) => {
  selectedAppointment.value = appointment
  showReviewModal.value = true
  reviewForm.value = { rating: 0, comment: '' }
}

const closeReviewModal = () => {
  showReviewModal.value = false
  selectedAppointment.value = null
}

const submitReview = async () => {
  try {
    await axios.post(`/api/appointments/${selectedAppointment.value._id}/review`, reviewForm.value)
    toast.success('Avis publié avec succès')
    closeReviewModal()
    fetchAppointments()
  } catch (error) {
    console.error('Erreur lors de la publication:', error)
    toast.error('Erreur lors de la publication de l\'avis')
  }
}

const viewDetails = (appointmentId: string) => {
  router.push(`/appointments/${appointmentId}`)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    'in-progress': 'En cours',
    completed: 'Terminé',
    cancelled: 'Annulé'
  }
  return texts[status] || status
}

onMounted(() => {
  fetchAppointments()
})
</script>
