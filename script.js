// * Jquery Method
// $('.search-button').on('click', function () {
//   $.ajax({
//     url: 'http://www.omdbapi.com/?apikey=1bcfb505&s=' + $('.input-keyword').val(),
//     success: (results) => {
//       const movies = results.Search;
//       console.log(movies);
//       let cards = '';
//       movies.forEach((m) => {
//         cards += showCards(m);
//       });
//       $('.movie-container').html(cards);

//       // * Click detail button
//       $('.modal-detail-button').on('click', function () {
//         //   console.log($(this).data('imdbid'));
//         $.ajax({
//           url: 'http://www.omdbapi.com/?apikey=1bcfb505&i&i=' + $(this).data('imdbid'),
//           success: (m) => {
//             const movieDetail = showMovieDetail(m);
//             $('.modal-body').html(movieDetail);
//           },
//           error: (e) => {
//             console.log(e.responseText);
//           },
//         });
//       });
//     },
//     error: (e) => {
//       console.log(e.responseText);
//     },
//   });
// });

// * Fetch Method
// ! fetch adalah sebuah method pada API javascript untuk mengambil dari jaringan, dan mengembalikan promise yang selesai(fulfilled) ketika ada response yang tersedia

// const searchButton = document.querySelector('.search-button');
// searchButton.addEventListener('click', function () {
//   const inputKeyword = document.querySelector('.input-keyword');
//   fetch('http://www.omdbapi.com/?apikey=1bcfb505&s=' + inputKeyword.value)
//     .then((response) => {
//       if (response.status === 200) {
//         return response.json();
//       } else if (response.status === 404) {
//         throw new Error('Movie not found');
//       } else {
//         throw new Error('Something went wrong');
//       }
//     })
//     .then((response) => {
//       if (response.Response === 'True') {
//         const movies = response.Search;
//         let cards = '';
//         movies.forEach((m) => (cards += showCards(m)));
//         const movieContainer = document.querySelector('.movie-container');
//         movieContainer.innerHTML = cards;

//         // * After click show detail button
//         const modalDetailButton = document.querySelectorAll('.modal-detail-button');

//         modalDetailButton.forEach((btn) => {
//           btn.addEventListener('click', function () {
//             const imdbid = this.dataset.imdbid;
//             fetch('http://www.omdbapi.com/?apikey=1bcfb505&i&i=' + imdbid)
//               .then((response) => response.json())
//               .then((m) => {
//                 const movieDetail = showMovieDetail(m);
//                 const modalBody = document.querySelector('.modal-body');
//                 modalBody.innerHTML = movieDetail;
//               });
//           });
//         });
//       } else {
//         const movieContainer = document.querySelector('.movie-container');
//         movieContainer.innerHTML = notFound();
//       }
//     });
// });

// * Fetch Refactor
const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', async function () {
  const inputKeyword = document.querySelector('.input-keyword');
  const movies = await getMovies(inputKeyword.value);
  console.log(movies);
  updateMovies(movies);
});

// * Event Binding
document.addEventListener('click', async function (e) {
  if (e.target.classList.contains('modal-detail-button')) {
    const imdbid = e.target.dataset.imdbid;
    const movieDetail = await getMovieDetail(imdbid);
    showDetail(movieDetail);
  }
});

function getMovies(keyword) {
  return fetch('http://www.omdbapi.com/?apikey=1bcfb505&s=' + keyword)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 404) {
        throw new Error('Movie not found');
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((response) => {
      if (response.Response === 'True') {
        return response.Search;
      } else {
        showNotFound();
      }
    });
}

function getMovieDetail(imdbid) {
  return fetch('http://www.omdbapi.com/?apikey=1bcfb505&i&i=' + imdbid)
    .then((response) => response.json())
    .then((m) => m);
}

function showDetail(m) {
  const movieDetail = showMovieDetail(m);
  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = movieDetail;
}

function showNotFound() {
  const movieContainer = document.querySelector('.movie-container');
  movieContainer.innerHTML = notFound();
}

function updateMovies(movies) {
  let cards = '';
  movies.forEach((m) => (cards += showCards(m)));
  const movieContainer = document.querySelector('.movie-container');
  movieContainer.innerHTML = cards;
}

function notFound() {
  const inputKeyword = document.querySelector('.input-keyword');
  return `<div class="col-md-4">
    <h1>There is no movie called ${inputKeyword.value}</h1>
  </div>`;
}

function showCards(m) {
  return `<div class="col-md-4 my-3">
        <div class="card">
          <img src="${m.Poster}" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">${m.Title}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">${m.Year}</h6>
            <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="${m.imdbID}">Show Detail</a>
          </div>
        </div>
      </div>`;
}

function showMovieDetail(m) {
  return `<div class="container-fluid">
              <div class="row">
                <div class="col-md-3">
                  <img src="${m.Poster}" class="img-fluid" alt="" />
                </div>
                <div class="col-md">
                  <ul class="list-group">
                    <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
                    <li class="list-group-item"><strong>Director: </strong> <br /> ${m.Director}</li>
                    <li class="list-group-item"><strong>Actors: </strong> <br /> ${m.Actors} </li>
                    <li class="list-group-item"><strong>Writers: </strong> <br /> ${m.Writer}</li>
                    <li class="list-group-item">
                      <strong>Plot</strong> <br />
                      ${m.Plot}
                    </li>
                  </ul>
                </div>
              </div>
            </div>`;
}
