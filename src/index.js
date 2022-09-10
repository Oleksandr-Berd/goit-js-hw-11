import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// import debounce from 'lodash.debounce';
const axios = require('axios').default;
const API_KEY = '29768584-66d59ea1e394ad82ebc4cd906';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}`;

class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }
  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.label = refs.button.querySelector('.label');
    refs.spinner = refs.button.querySelector('.spinner');

    return refs;
  }

  enable() {
    this.refs.button.disable = false;
    this.refs.label.textContent = 'Load more';
    this.refs.spinner.classList.add('is-hidden');
  }

  disable() {
    this.refs.button.disable = true;
    this.refs.label.textContent = 'Load...';
    this.refs.spinner.classList.remove('is-hidden');
  }

  show() {
    this.refs.spinner.classList.remove('is-hidden');
  }

  hide() {
    this.refs.spinner.classList.add('is-hidden');
  }
}

let searchQuerry = '';

let page = 1;

const refs = {
  input: document.querySelector('[name=query'),
  submit: document.querySelector('[type=submit]'),
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  //   loadMore: document.querySelector('[data-action=load-more]'),
};

refs.form.style.backgroundColor = '#0000D1';
refs.form.style.display = 'flex';
refs.form.style.justifyContent = 'center';
refs.form.style.height = '35px';
refs.submit.style.borderRadius = '10px';
refs.input.style.borderRadius = '10px';

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action=load-more]',
  hidden: true,
});

refs.form.addEventListener('submit', onSearch);

refs.input.addEventListener('input', refresh);

refs.gallery.addEventListener('click', onCl, { once: true });

loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

console.log(loadMoreBtn.refs.button);

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
    Notiflix.Notify.failure(error);
  }
}

function onSearch(evt) {
  evt.preventDefault();
  page = 1;
  searchQuerry = evt.currentTarget.elements.query.value;
  if (searchQuerry.length === 0) {
    refs.gallery.innerHTML = '';
    return;
  }

  loadMoreBtn.show();
  loadMoreBtn.disable();

  getGallery(searchQuerry).then(renderGallery).catch(errorGallery);
}

function onLoadMore(evt) {
  evt.preventDefault();
  console.log(evt);
  loadMoreBtn.disable();
  getGallery(searchQuerry).then(renderGallery).catch(errorGallery);
}

function errorGallery(error) {
  Notiflix.Notify.failure(error);
}

let lightbox = new SimpleLightbox('.gallery__image', {
  captionsData: `alt`,
  captionDelay: 250,
});

function onCl(evt) {
  evt.preventDefault();
  console.log(lightbox);
}

function renderGallery(request) {
  refs.gallery.innerHTML = '';
  page += 1;
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

  lightbox.refresh();

  loadMoreBtn.enable();
}
