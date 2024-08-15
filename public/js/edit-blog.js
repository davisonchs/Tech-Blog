
const editBlogPost = async (event) => {
    event.preventDefault();
    const title = document.querySelector('#postTitle').value.trim();
    const content = document.querySelector('#postContent').value.trim();
    const id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];
    if (title && content) {
        const response = await axios.put(`/api/users/${id}`, { title, content });
        if (response.status === 200) {
            document.location.assign('/api/users/dashboard');
            console.log('New blog post created');
        } else {
            alert('Failed to create new blog post');
        }
    }
};

const editPageUrl = window.location.href;
console.log(editPageUrl.split('/'));
const editPage = editPageUrl.split('/');
if (!editPage.includes('dashboard')) {
    document
        .querySelector('#updatePostBtn')
        .addEventListener('click', editBlogPost);
} else {
    document.querySelector('#updateBtn').style.display = 'none';
}

const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/api/users/dashboard');
        } else {
            alert('Failed to delete blog post');
        }
    }
};
const allButtons = document.querySelectorAll('#deleteBtn');
for (const button of allButtons) {
    button.addEventListener('click', delButtonHandler);
};