const APIRootUrl = "http://localhost:5678"
const loginPath = '/api/users/login'

const indexPath = '../index.html'

const form = document.querySelector('#login__form');
const error = form.querySelector('.form-error');

const errorMessage = "Erreur dans l’identifiant ou le mot de passe"

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    try {
        await submitLogin(form)
    } catch (e) {
        switch (e.name) {
            case 'UnauthorizedError':
                error.textContent = 'Erreur dans l’identifiant ou le mot de passe'
                break
            default:
                error.textContent = 'Oups... Un probleme est survenu'
        }
    }
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
    let error;
    switch (response.status) {
        default:
            error = new Error('Something went wrong');
            error.name = 'Bad Request'
            throw error
        case 401:
        case 404:
            error = new Error('User Not Found')
            error.name = 'UnauthorizedError'
            throw error
        case 200:
            const data = await response.json()
            login(data['token'])
            break
    }
}
