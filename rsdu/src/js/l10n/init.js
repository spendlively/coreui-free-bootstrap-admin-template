import {RSDU_TITLE, RSDU_LOGOUT_BTN, RSDU_SEARCH_PLACEHOLDER} from './l10n'
import $ from 'jquery'

export function init(){
    document.title = RSDU_TITLE
    $('#rsdu-logout-btn').html(RSDU_LOGOUT_BTN)
    $('#rsdu-search').attr({placeholder: RSDU_SEARCH_PLACEHOLDER})
}
