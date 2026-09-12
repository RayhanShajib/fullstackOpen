import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'
import CountryDetail from './components/CountryDetail'

const COUNTRIES_API = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  // Fetch all countries once on mount
  useEffect(() => {
    axios.get(COUNTRIES_API).then(response => {
      setAllCountries(response.data)
    })
  }, [])

  // Reset selected country whenever search changes
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const filtered = search.trim() === ''
    ? []
    : allCountries.filter(c =>
        c.name.common.toLowerCase().includes(search.toLowerCase())
      )

  // Auto-select if exactly one match
  useEffect(() => {
    if (filtered.length === 1) {
      setSelectedCountry(filtered[0])
    }
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderContent = () => {
    if (search.trim() === '') {
      return <p className="hint">Start typing a country name above…</p>
    }

    if (selectedCountry) {
      return (
        <CountryDetail
          country={selectedCountry}
          onBack={() => setSelectedCountry(null)}
        />
      )
    }

    if (filtered.length > 10) {
      return <p className="hint">Too many matches — please be more specific.</p>
    }

    if (filtered.length === 0) {
      return <p className="hint">No countries found for "{search}".</p>
    }

    return (
      <CountryList
        countries={filtered}
        onShow={(country) => setSelectedCountry(country)}
      />
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">🌍 Country Explorer</h1>
        <p className="app-subtitle">Search for any country to view its details and weather</p>
      </header>

      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          id="country-search"
          className="search-input"
          type="text"
          placeholder="Search countries…"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {renderContent()}
    </div>
  )
}

export default App
