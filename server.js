require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const movieData = require('./moviesData.json')

const app = express()
const SECRET_API_KEY = process.env.SECRET_API_KEY

app.use(morgan('common'))
app.use(cors())

app.use(handleAuth)


function handleAuth(req, res, next) {
  const apiToken = SECRET_API_KEY
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
}

app.get('/movie', (req, res) => {
  let filteredResults = movieData

  if (req.query.genre) {
    filteredResults = filteredResults.filter(movie => movie.genre.toLowerCase().indexOf(req.query.genre.toLowerCase()) !== -1)
  }

  if (req.query.country) {
    filteredResults = filteredResults.filter(movie => movie.country.toLowerCase().indexOf(req.query.country.toLowerCase()) !== -1)
  }

  if (req.query.avg_vote) {
    filteredResults = filteredResults.filter(movie => movie.avg_vote >= req.query.avg_vote)
  }

  return res.status(200).json(filteredResults)
})

app.listen(8000, () => {
  console.log('Server running')
})

// HTTP GET /movie 1.1 
// Headers: {Authorization: Bearer 1234567}
// Body: