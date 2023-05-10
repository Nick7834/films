const api_key = 'd68ec081-1282-4478-9883-8905dc0ed707'
const filmTop = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const searchApi = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const film_api = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

getFilms(filmTop)

async function getFilms(url) {
  const resp = await fetch(url, {
    headers: {
        'X-API-KEY': api_key,
        'Content-Type': 'application/json',
    },
  });

  const resData = await resp.json();
  showFilms(resData);
}

function getRating(rating) {
    if (rating >= 7 || rating >= '70%') {
        return 'green';
    } else if (rating >= 5 || rating >= '50%') {
        return 'orange';
    } else {
        return 'red';
    }
}

function showFilms(data) {
    const films = document.querySelector('.films');

    document.querySelector('.films').innerHTML = '';

    data.films.forEach(film => {
        const filmEl = document.createElement('div');
        filmEl.classList.add('film');

        filmEl.innerHTML = `
            <div class="film__cover">
                <img src="${film.posterUrl}" alt="${film.nameRu}">

                <div class="film__rating ${getRating(film.rating)}">${film.rating}</div>
            </div>

            <div class="film__info">
                <div class="film__name">${film.nameRu}</div>
                <div class="film__genres">
                    <div class="film__genre">${film.genres.map(gens => ` ${gens.genre}`)}</div>
                </div>
            </div>
        `;

        filmEl.addEventListener('click', () => openMobal(film.filmId));
        films.appendChild(filmEl);
    });
}

const form = document.querySelector('.header__form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', e => {
    e.preventDefault();

    const apiSearch = `${searchApi}${search.value}`;

    if (search.value) {
        getFilms(apiSearch)
    }
});

// modal 

const modalEl = document.querySelector('.modal');
const modalCard = document.querySelector('.modal__card');
const body = document.body;

async function openMobal(id) {

        const resp = await fetch(film_api + id, {
            headers: {
                'X-API-KEY': api_key,
                'Content-Type': 'application/json',
            },
        });

        const resData = await resp.json();

        modalEl.classList.add('open--modal');
        modalCard.classList.add('cardss');
        body.classList.add('stop-scroll');

        modalCard.innerHTML = `
                <div class="modal__img">
                    <img src="${resData.posterUrl}">
                </div>

                <div class="modal__info">
                    <button class="modal__close"></button>

                    <div class="modal__content">

                        <div class="modal__years">
                            <div class="modal__name">${resData.nameRu}</div>
                            <div class="modal__year">${resData.year}</div>
                        </div>

                        <ul class="modal__ul">
                            <li class="modal__list">Жанр:<span class="modal__text orang">${resData.genres.map(gens => ` ${gens.genre}`)}</span></li>
                            <li class="modal__list">Страна:<span class="modal__text orang">${resData.countries.map(gens => ` ${gens.country}`)}</span></li>
                            <li class="modal__list">Время:<span class="modal__text">${resData.filmLength} мин.</span></li>
                            
                            <li class="modal__list modal__bottom">Описание: <br>
                                <span class="modal__text">${resData.description}</span>
                            </li>
                            <li class="modal__list"><a href="${resData.webUrl}" target="_blank">Смотреть</a></li>
                        </ul>

                    </div>
                </div>
         `;

         const buttonClose = document.querySelector('.modal__close');
         buttonClose.addEventListener('click', () => closeMOdel())
}

function closeMOdel() {
    modalCard.classList.remove('cardss');
    modalEl.classList.remove('open--modal');
    body.classList.remove('stop-scroll');
}

window.addEventListener('click', e => {
    if(e.target === modalEl) {
        closeMOdel()
    }
});

window.addEventListener('keydown', e => {
    if (e.keyCode === 27) {
        closeMOdel()
    }
}); 