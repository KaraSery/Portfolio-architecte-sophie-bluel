const APIRootUrl = "http://localhost:5678"
const categoriesPath = '/api/categories'
const worksPath = '/api/works'

const getCategories = async function () {
    const url = new URL(APIRootUrl);
    url.pathname = categoriesPath

    const response = await fetch(url, {
        method: 'GET', headers: {
            'Accept': 'application/json',
        }
    })
    return await response.json()
}
const getWorks = async function () {
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
function filterWorksByCategory(category, works) {
    return works.filter(work => work.categoryId === category)
}

async function main() {

    // Gallery list items  HTML
    const works = await getWorks()
    console.log(works)
    const gallery = document.querySelector('.gallery')
    gallery.innerHTML = workListHTML(works)


    // categories filter html
    const categories = await getCategories()
    console.log(categories)
    const filters = document.querySelector('.filters')
    filters.innerHTML = categories.map(category => {
        return `${categoryHTML(category)}`
    }).join('')

    // Handle filter on click

    const filtersItem = Array.from(document.querySelectorAll('.filters__item'))

    filtersItem.forEach(filterLabel => {
        const input = filterLabel.querySelector('input')
        const category = parseInt(input.value)
        input.addEventListener('change', () => {
            const filteredWorks = filterWorksByCategory(category, works)
            gallery.innerHTML = workListHTML(filteredWorks)
        })
    })
}

main()