import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const keyPixabay = '36139966-d8e0729651e76793d90192565';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = ''; //сюда будем сохранять то, что ввел пользователь при сабмите формы (через геттер и сеттер)
    this.page = 1; //здесь будем хранить текущее значение страницы (и в будущем добалять +1 для пагинации)
    this.per_page = 40; //сколько будем рендерить фоток в каждом ответе с сервера
  }

  //функция, которая будет делать запросы на сервер используя библиотеку axios. Из этой функции возвращается результат (промис), который будем обрабатывать в файле index.js
  fetchData() {
    console.log(this); //смотрим что будет приходить в this
    return axios({
      url: BASE_URL,
      params: {
        key: keyPixabay,
        q: this.searchQuery, //при запросах в это свойство передаем значение searchQuery (то, что ищет пользователь)
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page, //в этот параметр будет приходить номер странички
        per_page: this.per_page,
      },
    }).then(({ data }) => {
      this.incrementPage(); //делаем вызов метода, который добавляет одну страничку для пагинации
      console.log(this);
      console.log(data);
      return data; //в data - значение промиса, которые возвращает pixabay.com/api/. Теперь в файле index.js при вызове pixabayApiService.fetchData() можно будет прицепить .then() для обработки результатов (например, рисования разметки). В данном случае в промисе объект с тремя ключами (total - общее кол-во найденных фото в базе данных, totalHits - количество доступных фото в моей бесплатной версии доступа к Pixabay, hits - массив с объектами фотографий).
    });
  }

  incrementPage() {
    this.page += 1;
  }

  //метод для сброса номера страницы до 1
  resetPage() {
    this.page = 1;
  }

  //для того, чтобы из внешнего кода записать значение searchQuery создаем сеттер и геттер
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
