import './styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreButtonRef = document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/';
const keyPixabay = '36139966-d8e0729651e76793d90192565';

loadMoreButtonRef.classList.add('is-hidden');

formRef.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();
  const searchQuery = event.currentTarget.elements.searchQuery.value;
  console.log(searchQuery);
  axios({
    url: `${BASE_URL}`,
    params: {
      key: `${keyPixabay}`,
      q: `${searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: '1',
      per_page: '40',
    },
  })
    .then(function (response) {
      console.log(response);
      if (response.data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        console.log(response);
        galleryRef.innerHTML = response.data.hits
          .map(
            element =>
              `
    <a href="${element.largeImageURL}">
      <div class="photo-card">
        <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
        <div class="info">
    <p class="info-item">
      <b>Likes${element.likes}</b>
    </p>
    <p class="info-item">
      <b>Views${element.views}</b>
    </p>
    <p class="info-item">
      <b>Comments${element.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads${element.downloads}</b>
    </p>
  </div>
</div>
</a>
    `
          )
          .join('');
        loadMoreButtonRef.classList.remove('is-hidden');
      }
    })
    .catch(function (error) {
      {
      }
    });
}
