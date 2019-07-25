
let orderMap = {
        dateup: 'timestamp-asc',
        datedown: 'timestamp-desc',
        stateup: 'state-asc',
        statedown: 'state-desc',
    },
    sortDirectionCls = {
        up: 'fa-angle-up',
        down: 'fa-angle-down'
    },
    currentOrder = {
        column: 'date',
        direction: 'down'
    }

export function isAllowed(column, direction){
    return orderMap[column+direction] !== undefined
}

export function getSortDirectionCls(){
    return sortDirectionCls
}

export function getCurrentOrder(){
    return currentOrder
}

export function setCurrentOrder(order){
    currentOrder = order
}

export function getOrder(){
    return orderMap[currentOrder.column + currentOrder.direction]
}

export function getSortingArrow(column){

    if(currentOrder.column === column){
        return `&nbsp;<i class="fa ${sortDirectionCls[currentOrder.direction]} rsdu-cursor-pointer rsdu-sort-column-icon" data-sort-column="${column}" data-sort-direction="${currentOrder.direction}"></i>`
    } else {
        return `&nbsp;<i class="fa rsdu-cursor-pointer rsdu-sort-column-icon" data-sort-column="${column}" data-sort-direction=""></i>`
    }
}
