import axios from 'axios'

//  Centralized Axios instance with base URL
const http = axios.create({
  // baseURL: 'https://api.themermaids.app/api/v1/',
   baseURL: 'http://127.0.0.1:5000/api/v1',
  timeout: 10000,

})

export default http
