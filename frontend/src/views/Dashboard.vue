<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-3xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        <p class="mt-2 text-gray-600">
          Bonjour {{ authStore.user?.firstName }}, voici un aperçu de votre activité
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CalendarIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Rendez-vous ce mois
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.appointmentsThisMonth }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Interventions terminées
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.completedAppointments }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ClockIcon class="h-6 w-6 text-yellow-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    En attente
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.pendingAppointments }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CurrencyEuroIcon class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total dépensé
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ formatPrice(stats.totalSpent) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Appointments -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Rendez-vous récents
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Vos dernières demandes d'intervention
            </p>
          </div>
          <router-link
            to="/appointments"
            class="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            Voir tout
          </router-link>
        </div>
        
        <ul v-if="recentAppointments.length > 0" class="divide-y divide-gray-200">
          <li v-for="appointment in recentAppointments" :key="appointment._id">
            <div class="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <WrenchScrewdriverIcon class="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ appointment.service }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ formatDate(appointment.scheduledDate) }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <span :class="getStatusClass(appointment.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusText(appointment.status) }}
                  </span>
                  <ChevronRightIcon class="ml-2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </li>
        </ul>
        
        <div v-else class="px-4 py-12 text-center">
          <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun rendez-vous</h3>
          <p class="mt-1 text-sm text-gray-500">
            Commencez par rechercher un plombier près de chez vous.
          </p>
          <div class="mt-6">
            <router-link
              to="/search"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
              Trouver un plombier
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyEuroIcon,
  WrenchScrewdriverIcon,
  ChevronRightIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const authStore = useAuthStore()

const stats = ref({
  appointmentsThisMonth: 0,
  completedAppointments: 0,
  pendingAppointments: 0,
  totalSpent: 0
})

const recentAppointments = ref([])

const fetchDashboardData = async () => {
  try {
    const [appointmentsRes] = await Promise.all([
      axios.get('/api/appointments?limit=5')
    ])
    
    recentAppointments.value = appointmentsRes.data.appointments
    
    // Calculer les stats
    const appointments = appointmentsRes.data.appointments
    stats.value.completedAppointments = appointments.filter(a => a.status === 'completed').length
    stats.value.pendingAppointments = appointments.filter(a => a.status === 'pending').length
    stats.value.totalSpent = appointments
      .filter(a => a.payment?.status === 'paid')
      .reduce((sum, a) => sum + (a.finalPrice || a.estimatedPrice || 0), 0)
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
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
