<template>
  <div ref="mapContainer" class="map-container mt-10 md:w-2/3 md:mx-auto">
    <div ref="overlay" class="overlay">
      Użyj dwóch palców aby wykonać interakcję z mapą
    </div>
  </div>
</template>

<script setup>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { onMounted, ref } from 'vue'
import axios from 'axios'

const mapContainer = ref(null)
const overlay = ref(null)

onMounted(async () => {
  const map = L.map(mapContainer.value, {
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: false,
    touchZoom: false
  }).setView([52.1, 19.4], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  try {
    const response = await axios.get('https://admin.mega1000.pl/api/styro-warehouses')
    const warehouses = response.data

    warehouses.forEach(warehouse => {
      try {
        const coords = JSON.parse(warehouse.cordinates)
        const marker = L.marker([coords.lat, coords.lng]).addTo(map)
        marker.bindPopup(`
            <a href="${warehouse.link}">
                <b>Magazyn odbioru: ${warehouse.symbol} - Kliknij aby zobaczyć produkty dostępne w tym punkcie</b>
            </a>
        `)
      } catch (error) {
        console.error('Failed to load warehouse data:', error)
      }
    })
  } catch (error) {
    console.error('Failed to load warehouse data:', error)
  }

  // Add event listeners to control map interactions based on touch points
  mapContainer.value.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      map.touchZoom.enable()
      map.dragging.enable()
      overlay.value.style.display = 'none'
    }
  })

  mapContainer.value.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
      map.touchZoom.disable()
      map.dragging.disable()
      overlay.value.style.display = 'flex'
    }
  })

  // Disable interactions if fewer than two touches are detected
  mapContainer.value.addEventListener('touchmove', (e) => {
    if (e.touches.length < 2) {
      map.touchZoom.disable()
      map.dragging.disable()
      overlay.value.style.display = 'flex'
    }
  })
})
</script>

<style scoped>
.map-container {
  position: relative;
  height: 500px;
}

.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  font-size: 18px;
  font-weight: bold;
  z-index: 1000;
  pointer-events: none;
}
</style>
