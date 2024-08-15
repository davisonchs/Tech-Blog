const newBlogPost = async (event) => {
    event.preventDefault();
    const title = document.querySelector('#postTitle').value.trim();
    const content = document.querySelector('#postContent').value.trim();
    if (title && content) {
        const response = await axios.post('/api/users', {title, content});
        if (response.status === 200) {
            document.location.assign('/api/users/dashboard');
            console.log('New blog post created');
        } else {
            alert('Failed to create new blog post');
        }
    }
};

document
    .querySelector('#publishBtn')
    .addEventListener('click', newBlogPost);