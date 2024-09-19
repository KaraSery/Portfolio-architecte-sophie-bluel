const APIRootUrl = "http://localhost:5678"
const loginPath = '/api/users/login'

const indexPath = '../index.html'

const form = document.querySelector('#login__form');
const error = form.querySelector('.form-error');

const errorMessage = "Erreur dans l’identifiant ou le mot de passe"

form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitLogin(form)
})

function login(token) {
    localStorage.setItem("token", token);
    window.location.href = indexPath;
}

async function submitLogin(form) {
    const url = new URL(APIRootUrl);
    url.pathname = loginPath
    const formData = new FormData(form)
    const body = Object.fromEntries(formData.entries())

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(body)
    })
    const data = await response.json()
    console.log(data)
    if ('token' in data) {
        login(data['token'])
    } else {
        error.textContent = errorMessage
    }
}
