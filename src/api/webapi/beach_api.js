// src/api/webapi/beach_api.js
import http from '@/api/http'

export async function getAllBeaches() {
  try {
    const response = await http.get('/beaches')
    return response.data.data  // accessing the "data" array
  } catch (error) {
    console.error('Failed to fetch beach data:', error)
    return []
  }
}


