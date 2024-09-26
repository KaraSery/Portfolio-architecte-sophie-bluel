import { initModalTogglers } from './utils.js';
export function setUpAdminAddModal() {
    const modal = document.getElementById('admin-add-dialog');
    const showModal = modal.showModal.bind(modal);
    const closeModal = modal.close.bind(modal)
    const showButtons = initModalTogglers('.admin-add-dialog-show', showModal)
    const closeButtons = initModalTogglers('.admin-add-dialog-close', closeModal)

    const addForm = modal.querySelector('.dialog__add-form')

    addForm.addEventListener('input', e => {
        if(addForm.checkValidity()) {
            addForm.submitInput.removeAttribute('disabled')
        } else {
            addForm.submitInput.setAttribute('disabled', '')
        }
    })
    addForm.addEventListener('submit', e => {
        e.preventDefault()
    })

}