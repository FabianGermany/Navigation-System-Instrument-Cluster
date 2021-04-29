export function init() {
	var mapcontainer = document.getElementById('mapid');

	var marker = L.icon({
		iconUrl: '../images/marker.png',
		iconSize: [60,60],
		iconAnchor: [0,37],
		popupAnchor: [-3, -76]
	});

	if (mapcontainer) {
		var map = L.map(mapcontainer, {zoomControl: false}).setView({lon: 9.20427, lat: 48.49144}, 19);

		// add the OpenStreetMap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 40,
			attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
		}).addTo(map);

		// show the scale bar on the lower left corner
		// L.control.scale().addTo(map);

		// show a marker on the map
		L.marker({lon: 9.20427, lat: 48.49144},{icon: marker}).bindPopup('Reutlingen').addTo(map);
	} else {
		console.log("Konnte div nicht finden");
	}
}