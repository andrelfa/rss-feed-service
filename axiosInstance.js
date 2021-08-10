const axios = require("axios")

const axiosInstance = axios.create({
  headers: {'X-Requested-With': 'XMLHttpRequest'}
})

module.exports = axiosInstance