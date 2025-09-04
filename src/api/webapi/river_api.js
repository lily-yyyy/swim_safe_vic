import http from '@/api/http'


export async function getAllRivers() {
  try {
    const response = await http.get('/rivers')
    return response.data.data 
  } catch (error) {
    console.error(' Failed to fetch rivers:', error)
    throw error
  }
}
