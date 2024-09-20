import { init, getWorkByID } from '../../index.js';

const APIRootUrl = "http://localhost:5678"
const worksPath = '/api/works'

function deleteWorkHTML(work) {
    return `
        <figure class="works-list__item">
            <button class="delete-button" value="${work.id}" type="button"><i class="fa-solid fa-trash-can"></i></button>
           <img src="${work.imageUrl}" alt="${work.title}"> 
        </figure>
    `
}

function deleteWorkListHTML(works) {
    return works.map(work => deleteWorkHTML(work)).join('')
}

async function deleteWork (workID) {
    if (!('token' in localStorage)) {
        const error = new Error('No token in localStorage')
        error.name = 'UnauthorizedError'
        throw error
    }
    const url = new URL(APIRootUrl);
    url.pathname = `${worksPath}/${workID}`
    const response = await fetch(url, {
        method: 'DELETE', headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    let error;
    switch (response.status) {
        case 401:
            error = new Error('You are not authorized to perform this action.')
            error.name = 'UnauthorizedError'
            throw error;
        case 500:
            error = new Error('Something went wrong')
            error.name = 'UnexpectedError'
            throw error;
        case 200:
        case 204:
            return response.status
    }
}
async function confirmDelete(workID, modal) {
    try {
        await deleteWork(workID)
        // Reinitialize everything
        modal.close()
        await init()
    } catch (e) {
        switch (e.name) {
            case 'UnauthorizedError':
                alert('you are not authenticated. authentication required to perform this operation');
                break;
            case 'UnexpectedError':
                alert('Something went wrong.');
        }
    }
}
function updateConfirmOrCancelDeleteWorkModal(work) {
    const confirmOrCancelModal = document.querySelector('.confirm-or-cancel-dialog')
    const confirmOrCancelText = confirmOrCancelModal.querySelector('.dialog__text')
    const confirmButton = confirmOrCancelModal.querySelector('.confirm')
    const cancelButton = confirmOrCancelModal.querySelector('.cancel')

    confirmOrCancelText.textContent = `Êtes vous sûr de vouloir supprimer le projet n°${work.id} - ${work.title} ?`
    async function _confirmDelete() {await confirmDelete(work.id, confirmOrCancelModal);}
    confirmButton.addEventListener('click', _confirmDelete)
    cancelButton.addEventListener('click', () => {
        confirmButton.removeEventListener('click', _confirmDelete)
        confirmOrCancelModal.close()
    })
    confirmOrCancelModal.showModal()
}
export function setUpDeleteWorkButtons(works) {
    const deleteWorkButtons = Array.from(document.querySelectorAll('#admin-delete-dialog .delete-button'))

    deleteWorkButtons.forEach(button =>
        button.addEventListener('click', async () => {
            const work = getWorkByID(parseInt(button.value), works)
            updateConfirmOrCancelDeleteWorkModal(work)
        }))
}
export function setUpAdminDeleteModal(works) {
    const modal = document.getElementById('admin-delete-dialog')
    const showButton = document.querySelector('.admin-delete-dialog-show')
    showButton.addEventListener('click', ()=> modal.showModal())

    const closeButton = modal.querySelector('.admin-delete-dialog-close')
    closeButton.addEventListener('click', () => modal.close())

    const deleteWorksList = modal.querySelector('.dialog__works-list')
    deleteWorksList.innerHTML = deleteWorkListHTML(works)
}
