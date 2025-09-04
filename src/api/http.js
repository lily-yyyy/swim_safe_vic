import axios from 'axios'

//  Centralized Axios instance with base URL
const http = axios.create({
  baseURL: 'http://13.237.199.23/api/v1',
  timeout: 10000,

})

export default http
