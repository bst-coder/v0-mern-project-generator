<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo et description -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <WrenchScrewdriverIcon class="w-8 h-8 text-blue-400" />
            <span class="text-xl font-bold">PlombierPro</span>
          </div>
          <p class="text-gray-300 mb-4">
            La plateforme de référence pour trouver des plombiers qualifiés près de chez vous.
            Service rapide, professionnel et de confiance.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white">
              <span class="sr-only">Facebook</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Services -->
        <div>
          <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
            Services
          </h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-300 hover:text-white">Plomberie générale</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Chauffage</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Sanitaire</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Dépannage urgence</a></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
            Support
          </h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-300 hover:text-white">Centre d'aide</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Contact</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">CGU</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Confidentialité</a></li>
          </ul>
        </div>
      </div>

      <div class="mt-8 border-t border-gray-700 pt-8">
        <p class="text-center text-gray-400">
          © {{ currentYear }} PlombierPro. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { WrenchScrewdriverIcon } from '@heroicons/vue/24/outline'

const currentYear = computed(() => new Date().getFullYear())
</script>
