<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-6">
          Trouvez le plombier parfait près de chez vous
        </h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          PlombierPro vous met en relation avec des plombiers qualifiés et vérifiés 
          pour tous vos besoins en plomberie.
        </p>
        
        <!-- Search Form -->
        <div class="bg-white rounded-lg p-6 max-w-4xl mx-auto shadow-lg">
          <form @submit.prevent="searchPlumbers" class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <input
                v-model="searchForm.service"
                type="text"
                placeholder="Quel service recherchez-vous ?"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
            <div class="flex-1">
              <input
                v-model="searchForm.location"
                type="text"
                placeholder="Votre ville ou code postal"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Rechercher
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Nos services</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="service in services"
            :key="service.id"
            class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            @click="selectService(service)"
          >
            <div class="text-blue-600 mb-4">
              <component :is="service.icon" class="w-12 h-12" />
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ service.name }}</h3>
            <p class="text-gray-600">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="bg-gray-100 py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1
            </div>
            <h3 class="text-xl font-semibold mb-2">Décrivez votre besoin</h3>
            <p class="text-gray-600">
              Indiquez le type d'intervention et votre localisation
            </p>
          </div>
          <div class="text-center">
            <div class="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              2
            </div>
            <h3 class="text-xl font-semibold mb-2">Choisissez votre plombier</h3>
            <p class="text-gray-600">
              Consultez les profils, avis et tarifs des plombiers disponibles
            </p>
          </div>
          <div class="text-center">
            <div class="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <h3 class="text-xl font-semibold mb-2">Planifiez l'intervention</h3>
            <p class="text-gray-600">
              Réservez un créneau et payez en ligne en toute sécurité
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-blue-600 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Vous êtes plombier ?</h2>
        <p class="text-xl mb-8">
          Rejoignez notre réseau de professionnels et développez votre activité
        </p>
        <router-link
          to="/register?role=plumber"
          class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
        >
          Devenir partenaire
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  WrenchScrewdriverIcon, 
  FireIcon, 
  HomeIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'

const router = useRouter()

const searchForm = ref({
  service: '',
  location: ''
})

const services = [
  {
    id: 'plomberie-generale',
    name: 'Plomberie générale',
    description: 'Installation, réparation et maintenance',
    icon: WrenchScrewdriverIcon
  },
  {
    id: 'chauffage',
    name: 'Chauffage',
    description: 'Chaudières, radiateurs, plancher chauffant',
    icon: FireIcon
  },
  {
    id: 'sanitaire',
    name: 'Sanitaire',
    description: 'Salle de bain, WC, éviers',
    icon: HomeIcon
  },
  {
    id: 'depannage-urgence',
    name: 'Dépannage urgence',
    description: 'Intervention rapide 24h/24',
    icon: ExclamationTriangleIcon
  }
]

const searchPlumbers = () => {
  router.push({
    name: 'PlumberSearch',
    query: {
      service: searchForm.value.service,
      location: searchForm.value.location
    }
  })
}

const selectService = (service: any) => {
  searchForm.value.service = service.name
}
</script>
