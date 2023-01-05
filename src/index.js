import { fetchPhotos } from './js/fetchPhotos';
import simplelightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import createListOfPhotos from './templates/createListOfPhotos.hbs';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const submitBtn = document.querySelector('.search-form button');
submitBtn.setAttribute('disabled', true);

const loadBtn = document.querySelector('.load-more')
loadBtn.style.display = "none"


let valueHandler = "";
let startPage = 1;
const limitPerPage = 40;

function handleSubmit(event) {
	// valueHandler = event.target.elements['searchQuery'].value;
	
	event.preventDefault();
	startPage = 1;
	loadBtn.style.display = 'block';
	gallery.innerHTML = ''
	
	fetchPhotos(valueHandler, startPage, limitPerPage)
		.then(data => {
			loadBtn.style.display = 'block';
			const totalPages = data.totalHits / limitPerPage;
			
			if (totalPages <= 1) {
                loadBtn.style.display = 'none';
            }
            if (!data.hits.length) {
                throw new Error();
			}
			renderPhoto(data);
			Notiflix.Notify.success(`We found ${data.totalHits} images`);
        })
        .catch(err => {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.'
            );
        });
}

function renderPhoto(photos) {
	gallery.insertAdjacentHTML("beforeend", createListOfPhotos(photos.hits))
    // gallery.innerHTML = createListOfPhotos(photos.hits);

    new simplelightbox('.gallery a', {
        captionDelay: 250,
    });
}

function handleInput(eve) {
	let inputValue = eve.target.value.trim();
	inputValue === "" ? submitBtn.setAttribute('disabled', true) : submitBtn.removeAttribute('disabled');
	valueHandler = inputValue
}

function loadHandler() {
	startPage += 1;
	fetchPhotos(valueHandler, startPage, limitPerPage).then(res => {
		
        const totalPages = res.totalHits / limitPerPage;
		console.log(startPage);
		
		if (startPage >= totalPages) {
			Notiflix.Notify.warning(`These are last photos`)
            loadBtn.style.display = 'none';
        }
        renderPhoto(res);
    });
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('input', handleInput);
loadBtn.addEventListener('click', loadHandler)