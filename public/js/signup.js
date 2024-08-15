const signUpFormFunction = async (event) => {
    event.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const email = document.querySelector('#signUpEmail').value.trim();
    const password = document.querySelector('#signUpPassword').value.trim();
    if (username && email && password) {
        const response = await axios.post('/api/users/signup', {username, email, password});   
        if (response.status === 200) {
            document.location.assign('/');
            console.log('logged in');
        } else {
            alert('Failed to log in');
        }
    }
}

document
    .querySelector('#submitBtn')
    .addEventListener('click', signUpFormFunction);