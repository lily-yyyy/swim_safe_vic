import http from '@/http'  // use the centralized axios instance

//  Get all toilets
export async function getToilets() {
  const response = await http.get('/toilets')
  return response.data
}

//  Get toilet by ID
export async function getToiletById(id) {
  const response = await http.get(`/toilets/${id}`)
  return response.data
}
