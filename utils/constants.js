const DEV_JWT_KEY = 'some-dev-key';

const VALIDATION_ERROR_NAME = 'ValidationError';
const BAD_REQUEST = 'Неверно переданы данные';
const BAD_URL = 'Не является URL адресом';
const NOT_AUTH_ERROR = 'Ошибка авторизации';
const NOT_FOUND_ERROR = 'Запрашиваемый ресурс не найден';
const NOT_FOUND_MOVIE_ERROR = 'Фильм с указанным id не найден';
const FORBIDDEN_DELETE_MOVIE_MESSAGE = 'Нет доступа к удалению фильма';
const NOT_AUTH_ERROR_WRONG_EMAIL_PASSWORD = 'Неправильные почта или пароль';
const INTERNAL_SERVER_ERROR = 'На сервере произошла ошибка';
const ERROR_KIND_OBJECT_ID = 'ObjectId';

const MONGO_DB_ADRESS_DEV = 'mongodb://localhost:27017/moviesdb';

const ALLOWED_CORS = [
  'api-movies-explorer.nomoredomains.work',
  'app.movies-explorer.nomoredomains.work',
  'http://localhost:3000',
];

const MOVIE_SCHEMA_REQUIRED_MESSAGES = {
  COUNTRY: 'Поле-строка "country - страна" является обязательным',
  DIRECTOR: 'Поле-строка "director - режиссёр" является обязательным',
  DURATION: 'Поле-число "duration - хронометраж" является обязательным',
  YEAR: 'Поле-строка "year - год" является обязательным',
  DESCRIPTION: 'Поле-строка "description - описание" является обязательным',
  NAME_RU: 'Поле-строка "nameRU - название фильма на русском языке" является обязательным',
  NAME_EN: 'Поле-строка "nameEN - название фильма на английском языке" является обязательным',
  IMAGE: 'Поле-строка "image - ссылка на постер к фильму" является обязательным',
  TRAILER: 'Поле-строка "trailer - ссылка на трейлер фильма" является обязательным',
  THUMBNAIL: 'Поле-строка "thumbnail - миниатюрное изображение постера к фильму" является обязательным',
  OWNER: 'Поле-строка "owner - _id пользователя, который сохранил статью" является обязательным',
  MOVIE_ID: 'Поле-число "movieId - id фильма, который содержится в ответе сервиса MoviesExplorer" является обязательным',
};

const MOVIE_SCHEMA_VALIDATE_MESSAGES = {
  IMAGE: 'не является URL адресом для постера к фильму',
  TRAILER: 'не является URL адресом для трейлера к фильму',
  THUMBNAIL: 'не является URL адресом для миниатюрного изображения постера к фильму',
};

const USER_SCHEMA_REQUIRED_MESSAGES = {
  EMAIL: 'Поле-строка "email - электронная почта" является обязательным',
  PASSWORD: 'Поле-строка "password - пароль" является обязательным',
  NAME: 'Поле-строка "name - имя пользователя" является обязательным',
};
const USER_SCHEMA_VALIDATE_MESSAGES = {
  EMAIL: 'Не является email',
  PASSWORD: 'Внесённый пароль не является надёжным',
  NAME: 'Не соответсвует диапазону длины строки - от 2 до 30 символов',
};

module.exports = {
  DEV_JWT_KEY,
  VALIDATION_ERROR_NAME,
  NOT_AUTH_ERROR,
  NOT_FOUND_ERROR,
  NOT_FOUND_MOVIE_ERROR,
  FORBIDDEN_DELETE_MOVIE_MESSAGE,
  NOT_AUTH_ERROR_WRONG_EMAIL_PASSWORD,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  BAD_URL,
  ERROR_KIND_OBJECT_ID,
  MONGO_DB_ADRESS_DEV,
  ALLOWED_CORS,
  MOVIE_SCHEMA_REQUIRED_MESSAGES,
  MOVIE_SCHEMA_VALIDATE_MESSAGES,
  USER_SCHEMA_REQUIRED_MESSAGES,
  USER_SCHEMA_VALIDATE_MESSAGES,
};
