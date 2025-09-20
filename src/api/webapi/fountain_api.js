// src/api/webapi/fountain_api.js
import http from '@/api/http'

export async function getFountains() {
  console.log('Fetching fountains...')

  try {
    const response = await http.get('/water-fountains')

    console.log('Fountain response:', response.data) // Confirm this is an array

    return response.data // ✅ RETURN the array
  } catch (error) {
    console.error('Error fetching fountains:', error)
    return [] // ✅ Safe fallback
  }
}
