import '../styles.css';
import PixabayApiService from './api-pixabay.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreButtonRef = document.querySelector('.load-more');

const pixabayApiService = new PixabayApiService(); //на основе класса PixabayApiService из файла api-pixabay.js создаем экземпляр класса (со свойствами и методами)

// loadMoreButtonRef.classList.add('is-hidden');

formRef.addEventListener('submit', onSearch);
loadMoreButtonRef.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  pixabayApiService.query = event.currentTarget.elements.searchQuery.value; //записываем термин поиска в свойство searchQuery через геттер и сеттер в файл api-pixabay.js

  //проверка 
  pixabayApiService.fetchData().then(({ hits, total }) => {
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  });

    clearGalleryContainer();
  pixabayApiService.resetPage(); //при сабмите формы сбрасываем термин запрос
  pixabayApiService.fetchData().then(renderMarkup); //на экземпляре класса pixabayApiService вызываем метод fetchData() из файла api-pixabay.js
}

function onLoadMore() {
  pixabayApiService.fetchData().then(renderMarkup);
}

function renderMarkup(photos) {
  console.log(photos);
  const markup = photos.hits
    .map(
      element => `
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
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

//функция для сброса разметки. Будет использоваться при смене термина запроса
function clearGalleryContainer() {
  galleryRef.innerHTML = '';
}

//.then(function (response) {
//       console.log(response);
//       if (response.data.hits.length === 0) {
//         Notiflix.Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       } else {
//         console.log(response);
//         galleryRef.innerHTML = response.data.hits
//           .map(
//             element =>
//               `
//     <a href="${element.largeImageURL}">
//       <div class="photo-card">
//         <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
//         <div class="info">
//     <p class="info-item">
//       <b>Likes${element.likes}</b>
//     </p>
//     <p class="info-item">
//       <b>Views${element.views}</b>
//     </p>
//     <p class="info-item">
//       <b>Comments${element.comments}</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads${element.downloads}</b>
//     </p>
//   </div>
// </div>
// </a>
//     `
//           )
//           .join('');
//         loadMoreButtonRef.classList.remove('is-hidden');
//       }
//     })
//     .catch(function (error) {
//       {
//       }
//     });
// }
