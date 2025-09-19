// 📁 src/webapi/notification_api.js
import http from '@/http'

// 🔹 Create a notification
export async function createNotification(payload) {
  const response = await http.post('/notifications', payload)
  return response.data
}
