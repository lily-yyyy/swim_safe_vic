// src/api/webapi/weather.js

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    if (!response.ok) throw new Error('Failed to fetch weather')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Weather API Error:', error)
    return null
  }
}
