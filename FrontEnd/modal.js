export function initModalTogglers(className, callBack) {
    const buttons = Array.from(document.querySelectorAll(className))
    buttons.forEach(
        button=>
            button.addEventListener('click', callBack))
    return buttons
}
/**
 *
 * @param {HTMLDialogElement} confirmOrCancelModal
 * @param {Function} confirmCallback
 * @param {String} confirmText
 */
export function updateConfirmOrCancelModal(confirmOrCancelModal, confirmCallback, confirmText) {
    const confirmOrCancelText = confirmOrCancelModal.querySelector('.dialog__text')
    const confirmButton = confirmOrCancelModal.querySelector('.confirm')
    const cancelButton = confirmOrCancelModal.querySelector('.cancel')

    confirmOrCancelText.textContent = confirmText

    confirmButton.addEventListener('click', confirmCallback, {once: true})
    cancelButton.addEventListener('click', ()=> {
        confirmButton.removeEventListener('click', confirmCallback)
        confirmOrCancelModal.close()
    })
    confirmOrCancelModal.showModal()
}

export function setUpAdminModal(id) {
    const modal = document.getElementById(id);
    const showModal = modal.showModal.bind(modal);
    const closeModal = modal.close.bind(modal)
    const showButtons = initModalTogglers(`.${id}-show`, showModal)
    const closeButtons = initModalTogglers(`.${id}-close`, closeModal)
}