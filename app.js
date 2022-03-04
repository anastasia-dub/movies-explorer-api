require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors: celebrateErrors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errors = require('./middlewares/errors');
const rateLimiter = require('./middlewares/rateLimit');

const { ALLOWED_CORS } = require('./utils/constants');

const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors({
  origin: ALLOWED_CORS,
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Cookie'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов

app.use(helmet());
app.use(rateLimiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);

app.use(errorLogger);
app.use(celebrateErrors());
app.use(errors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
