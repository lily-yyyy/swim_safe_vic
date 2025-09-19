// src/webapi/water_fountain_api.js
import http from '@/http'

export async function getWaterFountains() {
  const response = await http.get('/water-fountains')
  return response.data
}

export async function getWaterFountainById(id) {
  const response = await http.get(`/water-fountains/${id}`)
  return response.data
}
