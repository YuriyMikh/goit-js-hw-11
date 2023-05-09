import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const keyPixabay = '36139966-d8e0729651e76793d90192565';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = ''; //сюда будем сохранять то, что ввел пользователь при сабмите формы (через геттер и сеттер)
  }

  fetchData() {
    console.log(this);
    axios({
      url: BASE_URL,
      params: {
        key: keyPixabay,
        q: this.searchQuery, //при запросах в это свойство передаем начение searchQuery (то, что ищет пользователь)
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: '1',
        per_page: '40',
      },
    }).then(function (response) {
      console.log(response);
    });
  }
  //для того, чтобы из внешнего кода записать значение searchQuery создаем геттер и сеттер
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
