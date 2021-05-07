export function init() {
	var mapcontainer = document.getElementById('mapid');
	var map;

	var currentLocation = { //Stuttgart
		lat: 48.783, 
		lon: 9.192
	}

	var destinationLocation = { //Reutlingen
		lon: 9.20427,
		lat: 48.4914

	}

	var street = "Hauptstraße";

	var zoom_Level = 19

	// custom marker-icon
	var marker =  new L.icon({
		iconUrl: '../images/marker.png',
		iconSize: [60,60],
		iconAnchor: [0,37],
		popupAnchor: [-3, -76]
	});


	// setup map position and zoom (if html div loaded properly)
	if (mapcontainer) {
		map = L.map(mapcontainer, {zoomControl: false}).setView(currentLocation, zoom_Level);

		// add the OpenStreetMap tiles; TOOD maybe change to CartoDB tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 40,
			attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
		}).addTo(map);

		// L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png', {
		// 	maxZoom: 19,
		// 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
		// }).addTo(map);

		// show the scale bar on the lower left corner
		// L.control.scale().addTo(map);

	
	} else {
		console.log("Konnte div nicht finden");
	}

	// compass
	var comp = new L.Control.Compass({autoActive: true, showDigit:false, position:'bottomright'});
	map.addControl(comp);


	var route = L.Routing.control({

			createMarker: function(i, wp, nWps) {
				if (i === 0 || i === nWps - 1) {
					var startMarker = L.marker(wp.latLng, {
						icon: marker
					});
					return startMarker;
				} else {
				return L.marker(wp.latLng, {
					icon: marker
				});
				}
			},


			waypoints: [
				L.latLng(currentLocation.lat, currentLocation.lon), //Stuttgart
				L.latLng(destinationLocation.lat, destinationLocation.lon) //Reutlingen
			],

			lineOptions: {
				styles: [
				{
					color: "blue",
					//opacity: 0.6,
					weight: 4
				}
				]
			},

			addWaypoints: false,
			draggableWaypoints: false,
			fitSelectedRoutes: false,
			showAlternatives: false,
			
		}).addTo(map);
		
	route.hide(); //dont show the instruction box, only the route itself
	//route.show();



}