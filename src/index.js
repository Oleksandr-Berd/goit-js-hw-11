import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// import debounce from 'lodash.debounce';
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
  loadMore: document.querySelector('.load-more'),
};

refs.form.style.backgroundColor = '#0000D1';
refs.form.style.display = 'flex';
refs.form.style.justifyContent = 'center';
refs.form.style.height = '35px';
refs.submit.style.borderRadius = '10px';
refs.input.style.borderRadius = '10px';

refs.form.addEventListener('submit', onSearch);

refs.input.addEventListener('input', refresh);

refs.loadMore.addEventListener('click', onLoadMore);

function refresh(evt) {
  const check = evt.currentTarget.value;
  if (check.length === 0) {
    refs.gallery.innerHTML = '';
    return;
  }
}

async function getGallery(searchQuerry) {
  try {
    const response = await axios.get(
      `${BASE_URL}&q=${searchQuerry}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}

function onSearch(evt) {
  evt.preventDefault();
  searchQuerry = evt.currentTarget.elements.query.value;
  if (searchQuerry.length === 0) {
    refs.gallery.innerHTML = '';
    return;
  }
  getGallery(searchQuerry).then(renderGallery).catch(errorGallery);
}

function onLoadMore(searchQuerry) {
  refs.gallery.innerHTML = '';
  page += 1;
  getGallery(searchQuerry).then(renderGallery).catch(errorGallery);
}

function errorGallery(error) {
  console.log(error);
}

function renderGallery(request) {
  const data = request.data.hits;
  const dataArray = Object.values(data);
  const markUp = dataArray
    .map(el => {
      return `
      <a class="gallery__image href="${el.largeImageURL}">
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

  refs.gallery.addEventListener('click', onCl, { once: true });

  function onCl(evt) {
    evt.preventDefault();
    let lightbox = new SimpleLightbox('.gallery__image', {
      captionsData: `alt`,
      captionDelay: 250,
    });
    lightbox.refresh();
    console.log(refs.gallery);
  }
}
