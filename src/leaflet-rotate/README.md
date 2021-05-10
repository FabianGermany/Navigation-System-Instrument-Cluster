# Rotate Leaflet Map
Enable to rotate Leaflet maps. The code is based on a merger between lastest official leaflet version and leaflet `rotate` branch.
In addition, there are some improvements like:

* Fix popup
* Add getCircumscribedBounds
* Fix Draggable
* Fix `map.setView`
* Fix `_onDragStart` when map has `maxBounds` and map is rotated

## Demo
Look at `index.html` file in `examples` folder

## Usage

### Setup

* Add script to html. You can use `leaflet-src.js` in `./dist` folder. 
```html
<script src="leaflet-src.js"></script>
```

* You can also use `npm install leaflet-rotate-map` or `yarn add leaflet-rotate-map`.

### L.map(id, options)

To instantiate a `L.Map` with rotation, add `rotate` option

```js
const map = L.map('map', { rotate: true });
```