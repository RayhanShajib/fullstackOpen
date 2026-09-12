import { useState, useEffect } from 'react'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!capital || !API_KEY || API_KEY === 'your_api_key_here') {
      setLoading(false)
      return
    }

    setLoading(true)
    setWeather(null)

    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: capital,
          appid: API_KEY,
          units: 'metric',
        },
      })
      .then(response => {
        setWeather(response.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [capital])

  if (!API_KEY || API_KEY === 'your_api_key_here') {
    return (
      <div className="weather-card">
        <p className="weather-title">Weather in {capital}</p>
        <p className="loading">
          Add your <code>VITE_OPENWEATHER_API_KEY</code> to <code>.env</code> to see live weather.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="weather-card">
        <p className="weather-title">Weather in {capital}</p>
        <p className="loading">Loading weather…</p>
      </div>
    )
  }

  if (!weather) return null

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div className="weather-card">
      <p className="weather-title">Weather in {capital}</p>
      <div className="weather-main">
        <img
          className="weather-icon"
          src={iconUrl}
          alt={weather.weather[0].description}
        />
        <div>
          <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
          <div className="weather-desc">{weather.weather[0].description}</div>
        </div>
      </div>
      <div className="weather-details">
        <div className="weather-detail">
          💨 Wind&nbsp;<span>{weather.wind.speed} m/s</span>
        </div>
        <div className="weather-detail">
          💧 Humidity&nbsp;<span>{weather.main.humidity}%</span>
        </div>
        <div className="weather-detail">
          🌡 Feels like&nbsp;<span>{Math.round(weather.main.feels_like)}°C</span>
        </div>
      </div>
    </div>
  )
}

export default Weather
