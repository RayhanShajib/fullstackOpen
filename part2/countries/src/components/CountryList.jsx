const CountryList = ({ countries, onShow }) => (
  <div className="country-list">
    {countries.map(country => (
      <div key={country.cca3} className="country-list-item">
        <span className="country-list-name">
          <span className="country-list-flag">{country.flag}</span>
          {country.name.common}
        </span>
        <button className="show-btn" onClick={() => onShow(country)}>
          show
        </button>
      </div>
    ))}
  </div>
)

export default CountryList
