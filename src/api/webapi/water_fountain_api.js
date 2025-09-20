import http from '@/api/http'

/**
 * Get all water fountains
 * @returns {Promise<Array>} Fountain locations
 */
export async function getWaterFountains() {
  try {
    const response = await http.get('/water-fountains')
    return response.data
  } catch (error) {
    console.error('Failed to fetch water fountains:', error)
    return []
  }
}
