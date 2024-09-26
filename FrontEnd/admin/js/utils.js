export function initModalTogglers(className, callBack) {
    const buttons = Array.from(document.querySelectorAll(className))
    buttons.forEach(
        button=>
            button.addEventListener('click', callBack))
    return buttons
}