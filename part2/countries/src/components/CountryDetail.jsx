import Weather from './Weather'

const CountryDetail = ({ country, onBack }) => {
  const capital = country.capital?.[0]
  const languages = country.languages ? Object.values(country.languages) : []
  const area = country.area?.toLocaleString() ?? 'N/A'
  const population = country.population?.toLocaleString() ?? 'N/A'

  return (
    <div className="country-detail">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="country-detail-header">
        <img
          className="country-flag-img"
          src={country.flags?.svg || country.flags?.png}
          alt={country.flags?.alt || `Flag of ${country.name.common}`}
        />
        <div>
          <h1 className="country-name">{country.name.common}</h1>
          <p className="country-official">{country.name.official}</p>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <div className="info-label">Capital</div>
          <div className="info-value">{capital ?? 'N/A'}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Region</div>
          <div className="info-value">{country.region} {country.subregion ? `— ${country.subregion}` : ''}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Area</div>
          <div className="info-value">{area} km²</div>
        </div>
        <div className="info-card">
          <div className="info-label">Population</div>
          <div className="info-value">{population}</div>
        </div>
      </div>

      {languages.length > 0 && (
        <>
          <p className="section-title">Languages</p>
          <div className="lang-chips">
            {languages.map(lang => (
              <span key={lang} className="lang-chip">{lang}</span>
            ))}
          </div>
        </>
      )}

      {capital && <Weather capital={capital} />}
    </div>
  )
}

export default CountryDetail
