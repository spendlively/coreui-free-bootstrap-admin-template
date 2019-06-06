const BADGES_ID = 'rsdu-messages-badge'

export function getBadges(){
    let count = parseInt($(`#${BADGES_ID}`).html())
    return isNaN(count) ? 0 : count
}

export function setBadges(count){
    count = count === 0 ? '' : count
    $(`#${BADGES_ID}`).html(count)
}

export function clearBadges() {
    $(`#${BADGES_ID}`)
        .html('')
}

export function addBadges(count) {

    if (isMessagesPanelOpened()) {
        return
    }

    setBadges(getBadges() + count)
}

export function isMessagesPanelOpened() {
    return $('.aside-menu-lg-show').length > 0
}
