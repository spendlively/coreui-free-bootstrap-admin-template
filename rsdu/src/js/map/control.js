import L from "leaflet";

export function initialPositionControl(mapModel){

    L.Control.InitialPosition = L.Control.extend({
        onAdd: function(map) {
            let el = document.createElement('div');
            el.className = "leaflet-control-locate leaflet-bar leaflet-control";
            el.innerHTML = "<a class=\"leaflet-bar-part leaflet-bar-part-single\" title=\"Set initial map canter\"><span class=\"fa fa-home\"></span></a>";

            L.DomEvent
                .on(el, 'click', L.DomEvent.stopPropagation)
                .on(el, 'click', L.DomEvent.preventDefault)
                .on(el, 'click', this._onClick, this)
                .on(el, 'dblclick', L.DomEvent.stopPropagation)

            return el;
        },

        _onClick: function() {
            this._map.panTo(mapModel.coordinates)
        }
    });

    L.control.initialPosition = function(opts) {
        return new L.Control.InitialPosition(opts);
    }

    return L.control.initialPosition({ position: 'topleft' });
}
