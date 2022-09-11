import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;
const API_KEY = '29768584-66d59ea1e394ad82ebc4cd906';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}`;

let searchQuerry = '';

let page = 1;

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

// if (searchQuerry === '') {
//   refs.gallery.innerHTML = '';
// }

function refresh(evt) {
  let check = evt.target.value;
  console.log(evt.target.value);
  if (check === '') {
    searchQuerry = '';
    refs.gallery.innerHTML = '';
  }
}

async function getGallery(searchQuerry) {
  try {
    const response = await axios.get(
      `${BASE_URL}&q=${searchQuerry}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    return response;
  } catch (error) {
    Notiflix.Notify.failure(error);
  }
}

function onSearch(evt) {
  evt.preventDefault();
  page = 1;
  searchQuerry = evt.currentTarget.elements.query.value;
  if (searchQuerry === '') {
    refs.gallery.innerHTML = '';
    return;
  }

  getGallery(searchQuerry).then(renderGallery).catch(errorGallery);
}

function errorGallery(error) {
  Notiflix.Notify.failure(error);
}

function onCl(evt) {
  console.log(evt);
}

function renderGallery(request) {
  refs.gallery.innerHTML = '';
  page += 1;
  const data = request.data.hits;
  const dataArray = Object.values(data);
  const markUp = dataArray
    .map(el => {
      return `
      <a class="gallery__image" href="${el.largeImageURL}">
      <div class="photo-card">
        <img class="gallery__item" src="${el.webformatURL}" alt="${el.tags}" data-source="${el.largeImageURL}" loading="lazy" />
       
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

  const hurray = request.data;
  Notiflix.Notify.success(`Hooray! We found ${hurray.totalHits} images.`);

  refs.gallery.insertAdjacentHTML('afterbegin', markUp);

  // lightbox.refresh();
  let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: `alt`,
    captionDelay: 250,
  });
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && searchQuerry !== '') {
      refs.gallery.innerHTML = '';
      getGallery(searchQuerry).then(renderGallery).catch(errorGallery);
    }
  });
};
const options = {
  rootMargin: '150px',
};

const observer = new IntersectionObserver(onEntry, options);

observer.observe(refs.sentinel);
