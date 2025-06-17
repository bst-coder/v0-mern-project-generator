<template>
  <nav class="bg-white shadow-lg fixed w-full top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <WrenchScrewdriverIcon class="w-8 h-8 text-blue-600" />
          <span class="text-xl font-bold text-gray-800">PlombierPro</span>
        </router-link>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/search" class="text-gray-600 hover:text-blue-600 transition-colors">
            Trouver un plombier
          </router-link>
          <router-link to="/how-it-works" class="text-gray-600 hover:text-blue-600 transition-colors">
            Comment ça marche
          </router-link>
          
          <!-- Auth Links -->
          <div v-if="!authStore.isAuthenticated" class="flex items-center space-x-4">
            <router-link to="/login" class="text-gray-600 hover:text-blue-600 transition-colors">
              Connexion
            </router-link>
            <router-link to="/register" class="btn-primary">
              Inscription
            </router-link>
          </div>
          
          <!-- User Menu -->
          <div v-else class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <UserCircleIcon class="w-6 h-6" />
              <span>{{ authStore.user?.firstName }}</span>
              <ChevronDownIcon class="w-4 h-4" />
            </button>
            
            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10"
              @click="showUserMenu = false"
            >
              <router-link
                to="/dashboard"
                class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Tableau de bord
              </router-link>
              <router-link
                to="/appointments"
                class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Mes rendez-vous
              </router-link>
              <router-link
                to="/profile"
                class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Mon profil
              </router-link>
              <hr class="my-2">
              <button
                @click="authStore.logout()"
                class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="md:hidden text-gray-600 hover:text-blue-600"
        >
          <Bars3Icon v-if="!showMobileMenu" class="w-6 h-6" />
          <XMarkIcon v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden py-4 border-t">
        <div class="flex flex-col space-y-4">
          <router-link
            to="/search"
            class="text-gray-600 hover:text-blue-600 transition-colors"
            @click="showMobileMenu = false"
          >
            Trouver un plombier
          </router-link>
          
          <div v-if="!authStore.isAuthenticated" class="flex flex-col space-y-2">
            <router-link
              to="/login"
              class="text-gray-600 hover:text-blue-600 transition-colors"
              @click="showMobileMenu = false"
            >
              Connexion
            </router-link>
            <router-link
              to="/register"
              class="btn-primary text-center"
              @click="showMobileMenu = false"
            >
              Inscription
            </router-link>
          </div>
          
          <div v-else class="flex flex-col space-y-2">
            <router-link
              to="/dashboard"
              class="text-gray-600 hover:text-blue-600 transition-colors"
              @click="showMobileMenu = false"
            >
              Tableau de bord
            </router-link>
            <router-link
              to="/appointments"
              class="text-gray-600 hover:text-blue-600 transition-colors"
              @click="showMobileMenu = false"
            >
              Mes rendez-vous
            </router-link>
            <button
              @click="authStore.logout(); showMobileMenu = false"
              class="text-left text-gray-600 hover:text-blue-
