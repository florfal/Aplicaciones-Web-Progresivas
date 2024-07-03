document.getElementById('search-button').addEventListener('click', function() {
    var searchInput = document.getElementById('search-input').value.trim();
    if (searchInput !== '') {
        searchMovies(searchInput);
    } else {
        alert('Por favor, ingrese el título de la película.');
    }
});

document.getElementById('show-favorites-button').addEventListener('click', function() {
    showFavorites();
});

function searchMovies(title) {
    var apiKey = 'b24390c3';
    var apiUrl = 'http://www.omdbapi.com/?apikey=' + apiKey + '&s=' + encodeURIComponent(title);

    fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Esta película no se encuentra disponible.');
            }
            return response.json();
        })
        .then(function(data) {
            if (data.Response === 'True') {
                displayMovies(data.Search);
            } else {
                throw new Error(data.Error);
            }
        })
        .catch(function(error) {
            alert('Error: ' + error.message);
        });
}

function displayMovies(movies) {
    var resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    movies.forEach(function(movie) {
        var movieElement = createMovieElement(movie);
        resultsContainer.appendChild(movieElement);
    });
}

function createMovieElement(movie, isFavorite = false) {
    var movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    var poster = movie.Poster === 'N/A' ? 'https://via.placeholder.com/150' : movie.Poster;
    var posterImg = document.createElement('img');
    posterImg.src = poster;
    movieElement.appendChild(posterImg);

    var movieInfo = document.createElement('div');
    movieInfo.classList.add('movie-info');

    var title = document.createElement('p');
    title.textContent = 'Título: ' + movie.Title;
    movieInfo.appendChild(title);

    var year = document.createElement('p');
    year.textContent = 'Año: ' + movie.Year;
    movieInfo.appendChild(year);

    if (!isFavorite) {
        var addToFavoritesButton = document.createElement('button');
        addToFavoritesButton.textContent = 'Agregar a favoritos';
        addToFavoritesButton.addEventListener('click', function() {
            addToFavorites(movie);
        });
        movieInfo.appendChild(addToFavoritesButton);
    } else {
        var removeFromFavoritesButton = document.createElement('button');
        removeFromFavoritesButton.textContent = 'Eliminar de favoritos';
        removeFromFavoritesButton.addEventListener('click', function() {
            removeFromFavorites(movie.imdbID);
        });
        movieInfo.appendChild(removeFromFavoritesButton);
    }

    var moreInfoButton = document.createElement('button');
    moreInfoButton.textContent = 'Ver más';
    moreInfoButton.addEventListener('click', function() {
        showMoreInfo(movie.imdbID);
    });
    movieInfo.appendChild(moreInfoButton);

    movieElement.appendChild(movieInfo);
    return movieElement;
}

function addToFavorites(movie) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Película agregada a favoritos');
}

function removeFromFavorites(imdbID) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Película eliminada de favoritos');
    showFavorites(); 
}

function showFavorites() {
    var favoritesContainer = document.getElementById('favorites-container');
    favoritesContainer.innerHTML = '';

    var favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        favoritesContainer.textContent = 'No hay películas agregadas a favoritos.';
    } else {
        favorites.forEach(function(movie) {
            var movieElement = createMovieElement(movie, true);
            favoritesContainer.appendChild(movieElement);
        });
    }
}

// Función para mostrar más información de la película en un modal
function showMoreInfo(imdbID) {
    var apiKey = 'b24390c3';
    var apiUrl = 'http://www.omdbapi.com/?apikey=' + apiKey + '&i=' + imdbID;

    fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Esta película no se encuentra disponible.');
            }
            return response.json();
        })
        .then(function(data) {
            if (data.Response === 'True') {
                displayMovieInfo(data);
            } else {
                throw new Error(data.Error);
            }
        })
        .catch(function(error) {
            alert('Error: ' + error.message);
        });
}

function displayMovieInfo(movie) {
    var modalMovieInfo = document.getElementById('modal-movie-info');
    modalMovieInfo.innerHTML = `
        <h2>${movie.Title}</h2>
        <p><strong>Fecha de estreno:</strong> ${movie.Released}</p>
        <p><strong>Idioma original:</strong> ${movie.Language}</p>
        <p><strong>Rating:</strong> ${movie.imdbRating}</p>
        <p><strong>Descripción:</strong> ${movie.Plot}</p>
    `;

    var modal = document.getElementById('modal');
    var closeButton = document.querySelector('.close-button');

    modal.style.display = 'block';

    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}



  
  
  