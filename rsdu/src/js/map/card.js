import {
    RSDU_LAYER_CARD_LAYER,
    RSDU_LAYER_CARD_NAME,
    RSDU_LAYER_CARD_DESC,
    RSDU_LAYER_CARD_KTP,
    RSDU_LAYER_CARD_LATITUDE,
    RSDU_LAYER_CARD_LONGITUDE
} from '../l10n/l10n'

const card = new Map([
    ['layer', RSDU_LAYER_CARD_LAYER],
    ['guid', 'guid'],
    ['name', RSDU_LAYER_CARD_NAME],
    ['КТП', RSDU_LAYER_CARD_KTP],
    ['Наименование', RSDU_LAYER_CARD_NAME],
    ['description', RSDU_LAYER_CARD_DESC],
    ['Широта', RSDU_LAYER_CARD_LATITUDE],
    ['Долгота', RSDU_LAYER_CARD_LONGITUDE],
]);

export function getCard() {
    return card
}
