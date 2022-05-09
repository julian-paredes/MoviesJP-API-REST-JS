
const api = axios.create({
    baseURL :'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type': 'application/json;charset=utf-8',
    },
});


//UTILS O HELPERS

function createMovies(movies, container){
    container.innerHTML = '';

    movies.forEach(movie => {

        const movieContainer = document.createElement('div');
        movieContainer.setAttribute('class','movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        const movieImg = document.createElement('img');
        movieImg.setAttribute('class','movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src','https://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieContainer.appendChild(movieImg)
        container.appendChild(movieContainer);
    });
}

function createCategories(categories, container){
    container.innerHTML= '';

    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.setAttribute('class','category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.setAttribute('class','category-title');
        categoryTitle.setAttribute('id','id' + category.id);

        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        })
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);


        
    });
}

// LLAMADOS A API

async function getTrendingPreview() {
    const { data } = await api('trending/movie/day?api_key=' + API_KEY);

    const movies = data.results;
    console.log("Movies",movies);

    createMovies(movies, trendingMoviesPreviewList)

}

async function getCategoriesPreview() {
    const {data} = await api('genre/movie/list?api_key=' + API_KEY);

    const categories = data.genres;
    console.log("Movies",categories);

    createCategories(categories, categoriesPreviewList)

}

async function getMoviesByCategory(id) {
    const { data } = await api('discover/movie?api_key=' + API_KEY, {
        params: {
            with_genres: id,
        },
    });

    const movies = data.results;
    console.log("Movies",movies);

    genericSection.innerHTML = ' '
    createMovies(movies, genericSection);
}

async function getMoviesBySearch(query) {
    const {data} = await api('search/movie?api_key=' + API_KEY, {
        params: {
            query,
        },
    });

    const movies = data.results;

    createMovies(movies, genericSection)

}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day?api_key=' + API_KEY);

    const movies = data.results;
    console.log("Movies",movies);
    createMovies(movies, genericSection);

}

async function getMovieById(id) {

    const { data: movie } = await api(`movie/${id}?api_key=` + API_KEY);
    
    const movieImgURL = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `url(${movieImgURL})`;
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMovies(id);
}

async function getRelatedMovies(idRelated) {

    const { data } = await api(`movie/${idRelated}/similar?api_key=` + API_KEY);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);

}