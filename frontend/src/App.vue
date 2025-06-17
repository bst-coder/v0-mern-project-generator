<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navbar v-if="showLayout" />
    
    <main :class="{ 'pt-16': showLayout }">
      <router-view />
    </main>
    
    <Footer v-if="showLayout" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

const route = useRoute()
const showLayout = ref(true)

const isAuthPage = computed(() => {
  return ['/login', '/register', '/verify-email'].some(path => 
    route.path.startsWith(path)
  )
})

showLayout.value = !isAuthPage.value
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
