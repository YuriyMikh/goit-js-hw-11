import '../styles.css';
import PixabayApiService from './api-pixabay.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreButtonRef = document.querySelector('.load-more');

const modalLightboxGallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

const pixabayApiService = new PixabayApiService(); //на основе класса PixabayApiService из файла api-pixabay.js создаем экземпляр класса (со свойствами и методами)

loadMoreButtonRef.classList.add('is-hidden'); //скрываем кнопку "Load more"

formRef.addEventListener('submit', onSearch);
loadMoreButtonRef.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  pixabayApiService.query = event.currentTarget.elements.searchQuery.value; //записываем термин поиска в свойство searchQuery через геттер и сеттер в файл api-pixabay.js
  pixabayApiService.resetPage(); //при сабмите формы сбрасываем странички до единицы

  //на экземпляре класса pixabayApiService вызываем метод fetchData() из файла api-pixabay.js, цепляем .then() и обрабатываем полученные данные
  pixabayApiService.fetchData().then(data => {
    //проверка, если вернулся пустой массив - выводим сообщение о сбое
    if (data.hits.length === 0) {
      notificationFailure();
      clearGalleryContainer();
    }

    notificationSuccess(data.totalHits);
    clearGalleryContainer();
    renderMarkup(data);
    loadMoreButtonRef.classList.remove('is-hidden');
    console.log(data.totalHits);
  });
  // clearGalleryContainer();
  // pixabayApiService.resetPage(); //при сабмите формы сбрасываем странички до единицы
  // pixabayApiService.fetchData().then(renderMarkup); //на экземпляре класса pixabayApiService вызываем метод fetchData() из файла api-pixabay.js
}

function onLoadMore() {
  pixabayApiService
    .fetchData()
    .then(data => {
      //проверку переписать!
      if (!pixabayApiService.hasMorePhotos()) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        renderMarkup(data);
      }
    })
    //что вообще пишем в .catch()?
    .catch(data => {
      console.log(data);
      if (data.response.status === 400) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
}

function renderMarkup(data) {
  console.log(data);
  const markup = data.hits
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

//функция для вывода уведомления о сбое
function notificationFailure() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function notificationSuccess(total) {
  Notiflix.Notify.success(`Hooray! We found ${total} images.`);
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
