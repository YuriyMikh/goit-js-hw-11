import '../styles.css';
import PixabayApiService from './api-pixabay.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreButtonRef = document.querySelector('.load-more');

let simpleLightboxGallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

const pixabayApiService = new PixabayApiService(); //на основе класса PixabayApiService из файла api-pixabay.js создаем экземпляр класса (со свойствами и методами)

loadMoreButtonRef.classList.add('is-hidden'); //скрываем кнопку "Load more"

formRef.addEventListener('submit', onSearch);
loadMoreButtonRef.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  pixabayApiService.query = event.currentTarget.elements.searchQuery.value; //записываем термин поиска в свойство searchQuery через геттер и сеттер в файл api-pixabay.js
  pixabayApiService.resetPage(); //при сабмите формы сбрасываем странички до единицы
  loadMoreButtonRef.classList.add('is-hidden'); //при сабмите формы прячем кнопку, а ниже по коду fetchData() обработает поведение этой кнопки

  //на экземпляре класса pixabayApiService вызываем метод fetchData() из файла api-pixabay.js, цепляем .then() и обрабатываем полученные данные
  await pixabayApiService.fetchData().then(data => {
    //проверка, если вернулся пустой массив - выводим сообщение о сбое
    if (data.hits.length === 0) {
      notificationFailure();
      clearGalleryContainer();
      return;
    } else {
      notificationSuccess(data.totalHits);
    }
    //если текущая страница умноженная на кол-во фоток в странице больше чем общее кол-во фоток, которое вернулось с сервера выводим нотификацию об окончании поиска и прячем кнопку 'Load more'
    if (pixabayApiService.page * pixabayApiService.per_page > data.totalHits) {
      notificationEndSearch();
      loadMoreButtonRef.classList.add('is-hidden');
    } else {
      loadMoreButtonRef.classList.remove('is-hidden');
    }

    clearGalleryContainer();
    renderMarkup(data);
    simpleLightboxGallery.refresh();
    console.log(data.totalHits);
  });
}

async function onLoadMore() {
  await pixabayApiService
    .fetchData()
    .then(data => {
      if (
        pixabayApiService.page * pixabayApiService.per_page >
        data.totalHits
      ) {
        notificationEndSearch();
        loadMoreButtonRef.classList.add('is-hidden');
      } else {
        renderMarkup(data);
        simpleLightboxGallery.refresh();
      }
      console.log(pixabayApiService.page);
      console.log(pixabayApiService.per_page);
      console.log(pixabayApiService.page * pixabayApiService.per_page);
      console.log(data.totalHits);
    })
    //что вообще пишем в .catch()?
    .catch(data => {
      console.log(data);
      //в if ниже свойство status не может быть прочитано из undefined
      // if (data.response.status === 400) {
      //   Notiflix.Notify.failure(
      //     "We're sorry, but you've reached the end of search results."
      //   );
      // }
    });
}

//рендерим разметку
function renderMarkup(data) {
  console.log(data);
  const markup = data.hits
    .map(
      element => `
  <a href="${element.largeImageURL}">
    <div class="photo-card">
      <div class="thumb"
        <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
      </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${element.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${element.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${element.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${element.downloads}
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

//функция для вывода уведомления о кол-ве найденых фоток
function notificationSuccess(total) {
  Notiflix.Notify.success(`Hooray! We found ${total} images.`);
}

//функция для вывода уведомления об окончании рендера фоток, т.к. больше фотографий не найдено
function notificationEndSearch() {
  Notiflix.Notify.info(
    `We're sorry, but you've reached the end of search results.`
  );
}
