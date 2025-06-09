async function apiRequest(url, method = 'GET', data = null, headers = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (method !== 'GET' && data) {
    options.body = JSON.stringify(data);
  }

  if (method === 'GET' && data) {
    const params = new URLSearchParams(data).toString();
    url += '?' + params;
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

const button = document.querySelector('#get-message');

button.addEventListener('click', () => {
	console.log("VA");
	apiRequest("http://localhost:3000/api/contact/list")
		.then(data => {
			console.log(data);
			contactListDiv.innerHTML = JSON.stringify(data);
			})
		.catch(error => console.error(error));
});

const contactAddForm = document.querySelector('#contact-add');
const contactAddName = document.querySelector('#contact-add-name');
const contactAddEmail = document.querySelector('#contact-add-email');

contactAddForm.addEventListener('submit', (event) => {
	event.preventDefault();
	
})
