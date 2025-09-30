import http from '@/api/http'


//  Get all toilets
export async function getToilets() {
  try {
    const response = await http.get('/toilets')
    return response?.data ?? []
  } catch (error) {
  
    return []
  }
}

//  Get toilet by ID
export async function getToiletById(id) {
  try {
    const response = await http.get(`/toilets/${id}`)
    return response?.data ?? null
  } catch (error) {
    
    return null
  }
}

//  Submit a new toilet rating & comment
export async function submitToiletRating(payload) {
  try {
    const response = await http.post('/toilet-ratings', payload)
    return response?.data ?? { success: false }
  } catch (error) {
    
    return { success: false, error }
  }
}

//  Get the latest comments (all toilets, filter in frontend if needed)
export async function getLatestToiletComments() {
  try {
    const response = await http.get('/toilet-ratings/latest')
    return response?.data ?? []
  } catch (error) {
   
    return []
  }
}

//  Get the average rating for a specific toilet
export async function getToiletAverageRating(toiletId) {
  try {
    const response = await http.get(`/toilet-ratings/average/${toiletId}`)
    return response?.data ?? { average_rating: null, toilet_id: toiletId }
  } catch (error) {
    
    return { average_rating: null, toilet_id: toiletId }
  }
}
