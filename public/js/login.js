
const loginFormFunction = async (event) => {
    console.log('logging in');
    event.preventDefault();

    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();
    if (email && password) {
        const response = await axios.post('/api/users/login', { email, password });
        if (response.status === 200) {
            document.location.assign('/');
            console.log('logged in');
        } else {
            alert('Failed to log in');
        }
    }
};

document
    .querySelector('#loginBtn')
    .addEventListener('click', loginFormFunction);