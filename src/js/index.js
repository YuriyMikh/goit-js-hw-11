import '../styles.css';
import PixabayApiService from './api-pixabay.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreButtonRef = document.querySelector('.load-more');

//инициализируем SimpleLightbox
let simpleLightboxGallery = new SimpleLightbox('.gallery a');

const pixabayApiService = new PixabayApiService(); //на основе класса PixabayApiService из файла api-pixabay.js создаем экземпляр класса (со свойствами и методами)

formRef.addEventListener('submit', onSearch);
loadMoreButtonRef.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  //записываем термин поиска в свойство searchQuery через геттер и сеттер в файл api-pixabay.js
  pixabayApiService.query = event.currentTarget.elements.searchQuery.value
    .toLowerCase()
    .trim();

  pixabayApiService.resetPage(); //при сабмите формы сбрасываем странички до единицы

  //на экземпляре класса pixabayApiService вызываем метод fetchData() из файла api-pixabay.js. Обрабатываем данные через async await
  try {
    const { data } = await pixabayApiService.fetchData(); //сразу же деструктуризируем data

    //если вернулся пустой массив или пустая строка - выводим соответствующее сообщение-предупреждение.
    if (data.hits.length === 0 || pixabayApiService.query === '') {
      notificationFailure();
      clearGalleryContainer();
      return;
    }

    //если вернулось менее 40 фоток (data.hits.length) - просто рендерим разметку и вызываем нотификашку
    //если более 40 - делаем всё тоже самое, но открываем кнопку "Load more". Обработка ее нажатия ниже по коду
    if (data.hits.length < pixabayApiService.per_page) {
      notificationSuccess(data.totalHits);
      clearGalleryContainer();
      renderMarkup(data);
      simpleLightboxGallery.refresh();
    } else {
      clearGalleryContainer();
      notificationSuccess(data.totalHits);
      loadMoreButtonRef.classList.remove('is-hidden');
      renderMarkup(data);
      simpleLightboxGallery.refresh();
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  }
}

async function onLoadMore() {
  const { data } = await pixabayApiService.fetchData();

  try {
    //если с сервера пришло больше фоток чем общее кол-во фоток (data.totalHits), - выводим нотификацию об окончании поиска и прячем кнопку "Load more"
    // так как кол-во page приплюсовывается после каждого нажатия - в конце проверки делаем минус pixabayApiService.per_page
    if (
      pixabayApiService.page * pixabayApiService.per_page -
        pixabayApiService.per_page >
      data.totalHits
    ) {
      notificationEndSearch();
      renderMarkup(data);
      simpleLightboxGallery.refresh();
      loadMoreButtonRef.classList.add('is-hidden');
    } else {
      renderMarkup(data);
      loadMoreButtonRef.classList.remove('is-hidden');
      simpleLightboxGallery.refresh();

      //фича для плавной прокрутки странички вниз после нажатия на 'Load more'
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.log(error);
  }
}

//рендерим разметку
function renderMarkup(data) {
  const markup = data.hits
    .map(
      element => `
  <a href="${element.largeImageURL}" >
    <div class="photo-card">
      <div class="thumb">
        <img class="img" src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
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
