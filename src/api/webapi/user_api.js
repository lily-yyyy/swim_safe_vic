import http from '@/api/http'

//  GET all users
export async function getUsers() {
  const response = await http.get('/users')
  return response.data.data  // returns the "data" array directly
}

//  GET user by ID
export async function getUserById(id) {
  const response = await http.get(`/users/${id}`)
  return response.data
}

// POST (create) a new user
export async function createUser(email) {
  const response = await http.post('/users', { email })
  return response.data
}


export async function searchUserByEmail(email) {
  try {
    const response = await http.get('/users/search', {
      params: { email }
    })
    return response.data.data
  } catch (error) {
    if (error.response?.status === 404) {
      return null // treat as "user not found"
    }
    throw error // rethrow other errors
  }
}
