import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const search_box = document.querySelector("input#search-box");
const country_list = document.querySelector("ul.country-list");
const country_info = document.querySelector("div.country-info");

search_box.addEventListener('input', debounce((e) => {
  const name = e.target.value.trim();
  if(name !== ""){
    fetchCountries(name)
    .then((countries) => {
      const number = countries.length;
      if(number > 10){
        clearInnerHTML();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      }
      else if(number > 2){
        const markup = countries.map(({flags, name}) => {
          return `<li class="country-item">
                <svg class="country-icon">
                  <image xlink:href=${flags.svg} width="50">
                </svg>
              <h3 class="country-name">${name.official}</h3>
            </li>`;
        }).join("");
        country_info.innerHTML = "";
        country_list.innerHTML = markup;
      }
      else{
        let languagesList = Object.values(countries[0].languages).join(", ");
        const markup = `<li>
              <svg class="country-icon">
                  <image xlink:href=${countries[0].flags.svg} width="50">
                </svg>
              <h2 class="country-name">${countries[0].name.official}</h2>
              <p><b>Capital</b>: ${countries[0].capital}</p>
              <p><b>Population</b>: ${countries[0].population}</p>
              <p><b>Languages</b>: ${languagesList}</p>
            </li>`;
        country_list.innerHTML = "";
        country_info.innerHTML = markup;
      }
    })
    .catch((error) => {
      clearInnerHTML();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
  }
  else clearInnerHTML();
}, DEBOUNCE_DELAY));

function clearInnerHTML(){
  country_list.innerHTML = "";
  country_info.innerHTML = "";
}