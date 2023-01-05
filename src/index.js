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

const liteBox = new simplelightbox('.gallery a', {
    captionDelay: 250,
});

function handleSubmit(event) {
	// valueHandler = event.target.elements['searchQuery'].value;
	
	event.preventDefault();
	startPage = 1;
	loadBtn.style.display = 'block';
	gallery.innerHTML = ''
	
	getPhotos()
}

async function getPhotos() {
	const {totalHits, hits} = await fetchPhotos(valueHandler, startPage, limitPerPage)
	console.log(totalHits, hits);
	try {
		loadBtn.style.display = 'block';
		const totalPages = totalHits / limitPerPage;

		if (totalPages <= 1) {
			loadBtn.style.display = 'none';
		}
		if (!hits.length) {
			throw new Error();
		}
        console.log(startPage);

        if (startPage >= totalPages) {
            Notiflix.Notify.warning(`These are last photos`);
            loadBtn.style.display = 'none';
        }
		renderPhoto(hits);
		if (startPage === 1) {
			Notiflix.Notify.success(`We found ${totalHits} images`);
		}
	} catch {
		Notiflix.Notify.failure(
			'Sorry, there are no images matching your search query. Please try again.'
		);
	};
}

function renderPhoto(photos) {
	gallery.insertAdjacentHTML("beforeend", createListOfPhotos(photos))
    // gallery.innerHTML = createListOfPhotos(photos.hits);

    liteBox.refresh();
}

function handleInput(eve) {
	let inputValue = eve.target.value.trim();
	inputValue === "" ? submitBtn.setAttribute('disabled', true) : submitBtn.removeAttribute('disabled');
	valueHandler = inputValue
}

function loadHandler() {
	startPage += 1;
	getPhotos();
	// fetchPhotos(valueHandler, startPage, limitPerPage).then(res => {
		
    //     const totalPages = res.totalHits / limitPerPage;
	// 	console.log(startPage);
		
	// 	if (startPage >= totalPages) {
	// 		Notiflix.Notify.warning(`These are last photos`)
    //         loadBtn.style.display = 'none';
    //     }
    //     renderPhoto(res);
    // });
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('input', handleInput);
loadBtn.addEventListener('click', loadHandler)