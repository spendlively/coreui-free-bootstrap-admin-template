let temp = null

export function sanitizeHTML(str) {
    if (temp === null) {
        temp = document.createElement('div')
    }
    temp.textContent = str
    return temp.innerHTML
}
