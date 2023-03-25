const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: "436806408e43bf0150c9226d47643b86",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};

// Display Popular Movies

async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          ${
            movie.poster_path
              ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />`
              : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="Movie Title"
        />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>

    `;
    document.querySelector("#popular-movies").appendChild(div);
  });
}

// Display Popular TV Shows

async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");

  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
          ${
            show.poster_path
              ? `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
          />`
              : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="Movie Title"
        />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">
            <small class="text-muted">Air Date: ${show.first_air_date}</small>
          </p>
        </div>

    `;
    document.querySelector("#popular-shows").appendChild(div);
  });
}

// display movie details

async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];

  const movie = await fetchAPIData(`movie/${movieId}`);

  // overlay for background image

  displayBackgroundImage("movie", movie.backdrop_path);

  console.log(movie.backdrop_path);

  // console.log(movieId);

  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = `
    <div class="details-top">
          <div>
           ${
             movie.poster_path
               ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />`
               : `<img src="images/no-image.jpg" alt="${movie.title}" />`
           }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date} </p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres
                .map(
                  (genre) => `<li class="list-group-item">${genre.name}</li>`
                )
                .join("")}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
              movie.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
              movie.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${movie.production_companies
              .map(
                (company) => `
              <span>${company.name}</span>
            `
              )
              .join(", ")}  
          
          </div>
        </div>

    
    `;
  document.querySelector("#movie-details").appendChild(div);
}

// display Backdrop on Details Pages
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

// Search Movies/Shows
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.type !== null) {
    //@todo - make request and display results
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    console.log(global.search.totalResults);

    if (results.length === 0) {
      showErrorAlert("No results found");
    }
    displaySearchResults(results);

    document.querySelector("#search-term").value = "";
  } else {
    showErrorAlert("Please enter the search term and type", "error");
  }
}

function displaySearchResults(results) {
  // clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';


  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <a href="${global.search.type}-movie-details.html?id=${result.id}">
          ${
            result.poster_path
              ? `<img
            src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
            class="card-img-top"
            alt="${global.search.type === "movie" ? result.title : result.name}"
          />`
              : `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${global.search.type === "movie" ? result.title : result.name}"
        />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${
            global.search.type === "movie" ? result.title : result.name
          }</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${
              global.search.type === "movie"
                ? result.release_date
                : result.first_air_date
            }</small>
          </p>
        </div>

    `;

    document.querySelector("#search-results-heading").innerHTML = `
            <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;
    document.querySelector("#search-results").appendChild(div);
  });

  displayPagination();
}

// Display Pagination
function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
        <button class="btn btn-primary" id="prev">Prev</button>
        <button class="btn btn-primary" id="next">Next</button>
        <div class="page-counter">
            Page ${global.search.page} of ${global.search.totalPages}
        
        </div>
    `;

  document.querySelector("#pagination").appendChild(div);

  // Disable prev button if on page 1
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  // Add event listeners to prev and next buttons
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });


}

// Display Slider Movies
async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");
  console.log(results);

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }" />
      
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </h4>
    
    `;

    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
}

// Function to init swiper

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Fetch data from TMDB API

async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

// Make request to search
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );

  const data = await response.json();
  console.log(data);

  hideSpinner();

  return data;
}

// function to show spinner

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

// Highlight Active Link

function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// Show Error Alert

function showErrorAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}

// function add commas to numbers
function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Init App

function init() {
  switch (global.currentPage) {
    case "/":
      displayPopularMovies();
      displaySlider();
      console.log("Home");
      break;
    case "/index.html":
      displayPopularMovies();
      displaySlider();
      console.log("Home");
      break;
    case "/shows.html":
      displayPopularShows();
      console.log("Shows");
      break;
    case "/movie-details.html":
      displayMovieDetails();
      console.log("Movies");
      break;
    case "/tv-details.html":
      console.log("TV");
      break;
    case "/search.html":
      search();
      console.log("Search");
      break;
  }
}

document.addEventListener("DOMContentLoaded", init);

highlightActiveLink();
