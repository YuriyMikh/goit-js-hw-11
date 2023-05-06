import './styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');

formRef.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();
  const searchQuery = event.currentTarget.elements.searchQuery.value;
  console.log(searchQuery);
}

function renderMarkupGallery() {
  //прописать логику
  //добаить данные
  //тело функции
}

// Шаблон разметки карточки одного изображения для галереи:
// <div class="photo-card">
//   <img src="" alt="" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>
//     </p>
//     <p class="info-item">
//       <b>Views</b>
//     </p>
//     <p class="info-item">
//       <b>Comments</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>
//     </p>
//   </div>
// </div>;
