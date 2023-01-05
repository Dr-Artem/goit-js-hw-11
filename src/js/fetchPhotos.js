import axios from 'axios';

const API_KEY = '32580975-99621fb8f6adf27d1590057a5';

export async function fetchPhotos(name, page, limit) {
	let encoded = encodeURIComponent(name);
	
    let URL =
        'https://pixabay.com/api/?key=' +
        API_KEY +
        '&q=' +
        encoded +
        '&image_type=photo&orientation=horizontal&safesearch=true&page=' +
        page +
        '&per_page=' +
        limit;

	try {
		const response = await axios.get(URL)
		return response.data
	} catch (error) {
		console.warn(error);
	}
}
