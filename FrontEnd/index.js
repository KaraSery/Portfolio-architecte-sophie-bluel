const APIRootUrl = "http://localhost:5678"
const categoriesPath = '/api/categories'
const worksPath = '/api/works'


async function getCategories () {
    const url = new URL(APIRootUrl);
    url.pathname = categoriesPath
    const response = await fetch(url, {
        method: 'GET', headers: {
            'Accept': 'application/json',
        }
    })
    return await response.json()
}

async function getWorks() {
    const url = new URL(APIRootUrl);
    url.pathname = worksPath

    const response = await fetch(url, {
        method: 'GET', headers: {
            'Accept': 'application/json',
        }
    })

    return await response.json()
}

function categoryHTML(category) {
    return `
        <label  class="filters__item filter__label">
            <span>${category.name}</span>
            <input  type="radio" name="filter" class="filters__input" value="${category.id}">
        </label>
    `
}

function workHTML(work) {
    return `
        <figure>
            <img src=${work.imageUrl} alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        </figure>
    `
}
function workListHTML(works) {
    return works.map(work => {
        return `${workHTML(work)}`
    }).join(' ')
}
function filterWorksByCategory(categoryID, works) {
    return works.filter(work => work.categoryId === categoryID)
}

function getWorkByID(workID, works) {
    return works.find(work => work.id === workID)
}

function setupWorksInGallery(works) {
    const gallery = document.querySelector('.gallery')
    gallery.innerHTML = workListHTML(works)
    return gallery
}

function setupFilters(works) {
    const filtersItem = Array.from(document.querySelectorAll('.filters__item'))

    filtersItem.forEach(filterLabel => {
        const input = filterLabel.querySelector('input')
        const categoryID = parseInt(input.value)
        debugger
        function filterWorkAndUpdateWorkInGallery() {
            const filteredWorks = filterWorksByCategory(categoryID, works)
            setupWorksInGallery(filteredWorks)
        }
        input.addEventListener('change', filterWorkAndUpdateWorkInGallery)
    })
}

function setCategoriesFilters(categories, works) {
    const filters = document.querySelector('.filters')
    filters.innerHTML = categories.map(category => categoryHTML(category)).join('')
    setupFilters(works)

    return filters
}
async function init() {
    const works = await getWorks()
    const gallery = setupWorksInGallery(works)

    const categories = await getCategories()
    const filters = setCategoriesFilters(categories, works)
}

async function main() {
    await init()
}

main()