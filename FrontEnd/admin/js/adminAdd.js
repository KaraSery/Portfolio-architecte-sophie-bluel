import {updateWorksLists} from "../../index.js";
import {updateConfirmOrCancelModal} from "../../modal.js";

const APIRootUrl = "http://localhost:5678"
const worksPath = '/api/works'

export function categoriesSelectOptionsHTML(categories) {
    return categories.map(
        category => `<option value="${category.id}">${category.name}</option>`)
}

async function addWork(formData) {
    const url = new URL(APIRootUrl);
    url.pathname = worksPath
    const response = await fetch(url, {
        method: 'POST', headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
        },
        body: formData
    })
    let error;
    switch (response.status) {
        case 400:
            error = new Error('Bad Request')
            error.name = 'BadRequestError'
            throw error
        case 401:
            error = new Error('You are not authorized to perform this action.')
            error.name = 'UnauthorizedError'
            throw error;
        case 500:
            error = new Error('Something went wrong')
            error.name = 'UnexpectedError'
            throw error;
        case 201:
            return await response.json()
    }
}

async function confirmAdd(formData, modal) {
    try {
        await addWork(formData)
        modal.close()
        const addForm = document.querySelector('.dialog__add-form')
        addForm.reset()
        addForm.submitInput.setAttribute('disabled', '')
        updateWorksLists()
    } catch (e) {
        switch (e.name) {
            case 'UnauthorizedError':
                alert('you are not authenticated. authentication required to perform this operation');
                break
            case 'UnexpectedError':
                alert('Something went wrong.');
        }
    }
}

export function setUpAddForm(categories) {
    const modal = document.getElementById('admin-add-dialog')
    const addForm = document.querySelector('.dialog__add-form')
    addForm.category.innerHTML = categoriesSelectOptionsHTML(categories)

    addForm.addEventListener('input', async e => {
        addForm.checkValidity() ?
            addForm.submitInput.removeAttribute('disabled') :
            addForm.submitInput.setAttribute('disabled', '')
    })
    addForm.image.addEventListener('change', () => {
        if (addForm.image.checkValidity()) {
            const displayImageWrapper = addForm.image.labels[0].querySelector('.display-image')
            const reader = new FileReader()
            reader.addEventListener('load', (e)=> {
                displayImageWrapper.outerHTML = `
                <div class="display-image show">
                    <img src="${reader.result}">
                </div>
                `
            })
            reader.readAsDataURL(addForm.image.files[0])
        }
    })
    addForm.addEventListener('submit', async e => {
        e.preventDefault()
        const formData = new FormData(addForm)
        const confirmOrCancelModal = modal.querySelector('.confirm-or-cancel-dialog')

        const confirmText = `Êtes vous sûr de vouloir ajouter ce projet - ${formData.get('title')} ?`

        async function _confirmAdd() {
            await confirmAdd(formData, confirmOrCancelModal);
        }

        updateConfirmOrCancelModal(confirmOrCancelModal, _confirmAdd, confirmText)
    })
}