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
  pixabayApiService.query = event.currentTarget.elements.searchQuery.value; //в свойство searchQuery через геттер и сеттер в файл api-pixabay.js записываем термин поиска
  pixabayApiService.fetchData(); //на экземпляре класса pixabayApiService вызываем метод fetchData() из файла api-pixabay.js
}

function onLoadMore() {
  pixabayApiService.fetchData();
}

//       .then(function (response) {
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
