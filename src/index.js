import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import API from './js/getGallery.js';

const axios = require('axios').default;
const API_KEY = '29768584-66d59ea1e394ad82ebc4cd906';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}`;

let searchQuerry = '';

let page = 0;

let perPage = 40;

const refs = {
  input: document.querySelector('[name=query'),
  submit: document.querySelector('[type=submit]'),
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  sentinel: document.querySelector('.sentinel'),
};

refs.submit.style.borderRadius = '10px';
refs.input.style.borderRadius = '10px';

refs.form.addEventListener('submit', onSearch);
refs.gallery.addEventListener('click', onCl);
refs.input.addEventListener('input', refresh);

function refresh(evt) {
  let check = evt.target.value;
  if (check === '') {
    searchQuerry = '';
    refs.gallery.innerHTML = '';
  }
}

// async function getGallery(searchQuerry) {
//   try {
//     const response = await axios.get(
//       `${BASE_URL}&q=${searchQuerry}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
//     );
//     return response;
//   } catch (error) {
//     Notiflix.Notify.failure(error);
//   }
// }

function onSearch(evt) {
  evt.preventDefault();
  page = 1;
  searchQuerry = evt.currentTarget.elements.query.value;
  if (searchQuerry === '') {
    refs.gallery.innerHTML = '';
    return;
  }

  API.getGallery(searchQuerry).then(renderGallery).catch(errorGallery);
}

function errorGallery(error) {
  Notiflix.Notify.failure(error);
  console.log(error);
}

function onCl(evt) {
  console.log(evt);
}

function renderGallery(request) {
  const data = request.data.hits;
  const hurray = request.data;
  const dataArray = Object.values(data);
  // const checkTotal = hurray.totalHits / perPage;
  const markUp = dataArray
    .map(el => {
      return `
      <a class="gallery__image" href="${el.largeImageURL}">
      <div class="photo-card">
        <img class="gallery__item" src="${el.webformatURL}" alt="${el.tags}" data-source="${el.largeImageURL}" width="640px" height = "480px" loading="lazy" />
       
        <div class="info">
        <p class="info-item">
          <b>Likes: ${el.likes}</b>
        </p>
         <p class="info-item">
          <b>Views: ${el.views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${el.comments}</b>
         </p>
        <p class="info-item">
      <b>Downloads: ${el.downloads}</b>
        </p>
      </div>
      
      </div>
      </a>`;
    })
    .join('');

  if (hurray.totalHits === 0) {
    Notiflix.Notify.info(`Sorry! We didn't find anything(((.`);
  } else if (hurray.totalHits - page * perPage < 40) {
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
  } else {
    Notiflix.Notify.success(`Hooray! We found ${hurray.totalHits} images.`);
  }

  refs.gallery.insertAdjacentHTML('afterbegin', markUp);

  let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: `alt`,
    captionDelay: 250,
  });
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && searchQuerry !== '') {
      refs.gallery.innerHTML = '';
      API.getGallery(searchQuerry).then(renderGallery).catch(errorGallery);
    }
  });
};
const options = {
  rootMargin: '150px',
};

const observer = new IntersectionObserver(onEntry, options);

observer.observe(refs.sentinel);
