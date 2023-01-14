import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const search_box = document.querySelector("input#search-box");
const country_list = document.querySelector("ul.country-list");
const country_info = document.querySelector("div.country-info");

search_box.addEventListener('input', debounce(loadCountries, DEBOUNCE_DELAY));

function loadCountries(e){
  const name = e.target.value.trim();
  clearInnerHTML();
  if(name){
    fetchCountries(name)
    .then((countries) => {
      const number = countries.length;
      if(number > 10){
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      }
      else if(number > 2){
        createCountryList(countries);
      }
      else{
        createCountryInfo(countries);
      }
    })
    .catch((error) => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
  }
}

function clearInnerHTML(){
  country_list.innerHTML = "";
  country_info.innerHTML = "";
}

function createCountryList(countries){
  const markup = countries.map(({flags, name}) => {
    return `<li class="country-item">
          <svg class="country-icon">
            <image xlink:href=${flags.svg} width="50">
          </svg>
        <h3 class="country-name">${name.official}</h3>
      </li>`;
  }).join("");
  country_list.innerHTML = markup;
}

function createCountryInfo([country]){
  let languagesList = Object.values(country.languages).join(", ");
    const markup = `<li>
        <svg class="country-icon">
          <image xlink:href=${country.flags.svg} width="50">
        </svg>
        <h2 class="country-name">${country.name.official}</h2>
        <p><b>Capital</b>: ${country.capital}</p>
        <p><b>Population</b>: ${country.population}</p>
        <p><b>Languages</b>: ${languagesList}</p>
      </li>`;
  country_info.innerHTML = markup;
}