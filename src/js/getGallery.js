const axios = require('axios').default;
const API_KEY = '29768584-66d59ea1e394ad82ebc4cd906';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}`;
let searchQuerry = '';

let page = 1;

let perPage = 40;

async function getGallery(searchQuerry) {
  try {
    // refs.gallery.innerHTML = '';
    page += 1;
    const response = await axios.get(
      `${BASE_URL}&q=${searchQuerry}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
    );
    return response;
  } catch (error) {
    Notiflix.Notify.failure(error);
  }
}

export default { getGallery };
