<template>
  <div ref="mapContainer" class="map-container mt-10 md:w-2/3 md:mx-auto"></div>
</template>

<script setup>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { onMounted, ref } from 'vue'
import axios from 'axios'

const mapContainer = ref(null)

onMounted(async () => {
  const map = L.map(mapContainer.value).setView([52.1, 19.4], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  try {
    const response = await axios.get('https://admin.mega1000.pl/api/styro-warehouses')
    const warehouses = response.data

    warehouses.forEach(warehouse => {
      const coords = JSON.parse(warehouse.cordinates)
      const marker = L.marker([coords.lat, coords.lng]).addTo(map)
      marker.bindPopup(`
        <a href="${warehouse.link}">
            <b>Magazyn odbioru: ${warehouse.symbol} - Kliknij aby zobaczyć produkty</b>
        </a>
    `)
    })
  } catch (error) {
    console.error('Failed to load warehouse data:', error)
  }
})
</script>

<style scoped>
.map-container {
  height: 500px;
}
</style>
