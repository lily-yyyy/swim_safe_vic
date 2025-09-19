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

