const API_KEY = "81c7ba2069845d43afd41a1689a5dceb";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

async function openModalWithMovie(movie) {
  document.getElementById("modal-title").innerText = movie.title || movie.name;
  document.getElementById("modal-description").innerText = movie.overview;
  document.getElementById("modal-image").src = `${IMAGE_URL}${movie.poster_path}`;

  // Show stars rating
  const ratingEl = document.getElementById("modal-rating");
  ratingEl.innerHTML = "";
  const stars = Math.round(movie.vote_average / 2);
  for (let i = 0; i < 5; i++) {
    const star = document.createElement("i");
    star.className = i < stars ? "fa fa-star" : "fa fa-star-o";
    ratingEl.appendChild(star);
  }

  // Get trailer from TMDB
  const trailerUrl = await getTrailerUrl(movie.id, movie.media_type || "movie");
  const trailerIframe = document.getElementById("modal-trailer");
  if (trailerUrl) {
    trailerIframe.src = trailerUrl;
    trailerIframe.style.display = "block";
  } else {
    trailerIframe.style.display = "none";
  }

  // Set your own full movie URL here if you have one
  const fullMovieUrl = ""; // Example: "https://yourdomain.com/videos/movie.mp4"

  const videoPlayer = document.getElementById("modal-video");
  const videoSource = document.getElementById("video-source");

  if (fullMovieUrl) {
    videoSource.src = fullMovieUrl;
    videoPlayer.load();
    videoPlayer.style.display = "block";
  } else {
    videoPlayer.style.display = "none";
  }

  document.getElementById("modal").style.display = "block";
}

async function getTrailerUrl(id, type) {
  try {
    const res = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
    const data = await res.json();
    const trailer = data.results.find(v => v.site === "YouTube" && v.type === "Trailer");
    if (trailer) {
      return `https://www.youtube.com/embed/${trailer.key}`;
    }
  } catch (error) {
    console.error("Failed to get trailer URL:", error);
  }
  return null;
}

function closeModal() {
  document.getElementById("modal").style.display = "none";

  // Stop trailer
  const trailerIframe = document.getElementById("modal-trailer");
  trailerIframe.src = "";

  // Stop video
  const videoPlayer = document.getElementById("modal-video");
  videoPlayer.pause();
  videoPlayer.src = "";
}
