export function init() {

	/*Variables*/

	var mapcontainer = document.getElementById('mapid');

	var ETAContainer = document.getElementById('ETA');
	var remainingdurationContainer = document.getElementById('remaining_duration');
	var distanceContainer = document.getElementById('distance');

	var allowed_speedContainer = document.getElementById('allowed_speed');
	var name_of_streetContainer = document.getElementById('name_of_street');
	var remaining_distance_to_next_actionContainer = document.getElementById('remaining_distance_to_next_action');
	var name_of_actionContainer = document.getElementById('name_of_action'); 

	var map;

	var currentLocation = { //Reutlingen
		lon: 9.20427,
		lat: 48.49144
	}

	var destinationLocation = { //Stuttgart
		lon: 9.192,
		lat: 48.783
	}

	var zoom_Level = 19

	// custom marker-icon
	var marker =  new L.icon({
		iconUrl: '../images/marker.png',
		iconSize: [60,60],
		iconAnchor: [0,37],
		popupAnchor: [-3, -76]
	});

	var tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';
	//alternatives: 
	//https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png 
	//https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png
	//https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png


	// setup map position and zoom (if html div loaded properly)
	if (mapcontainer) {
		map = L.map(mapcontainer, {zoomControl: false, rotate: true})
			.setView(currentLocation, zoom_Level);



		// add the OpenStreetMap tiles; TOOD maybe change to CartoDB tiles
		L.tileLayer(tileUrl, {
			maxZoom: 20,
			attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
		}).addTo(map);



		// show the scale bar on the lower left corner
		// L.control.scale().addTo(map);
	
	} else {
		console.log("Konnte div nicht finden");
	}


	// Dynamic Compass doesnt work anymore; so we use static one
	//var comp = new L.Control.Compass({autoActive: true, showDigit:true, position:'bottomright'});
	//map.addControl(comp);



	//auto-rotate map
	var deg = 73;
	var compass = document.getElementById('compass_static');
	map.setBearing(deg); // TODO
	compass.style.transform = 'rotate(' + deg + 'deg)';




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
				L.latLng(currentLocation.lat, currentLocation.lon), //Reutlingen
				L.latLng(destinationLocation.lat, destinationLocation.lon) //Stuttgart
			],

			lineOptions: {
				styles: [
				{
					color: '#00A4E1',
					//opacity: 1,
					weight: 11
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

			




	//Shown data for driver
	//************************* */


	//setup arrival time, duration & distance 
	route.on('routesfound', function(e) {
		var routes = e.routes;
		var summary = routes[0].summary;
		var totalTime = secondsToHm(summary.totalTime);
		
		// setup distance
		if (summary.totalDistance > 1000) {
			distanceContainer.innerHTML = Math.round((summary.totalDistance / 1000) * 10) / 10 + " km";
		} else {
			distanceContainer.innerHTML = Math.round(summary.totalDistance) + " m";
		}

		//setup duration
		remainingdurationContainer.innerHTML = formatDuration(totalTime.hours, totalTime.minutes, totalTime.seconds);

		//setup time of arrival
		ETAContainer.innerHTML = getDate(totalTime.hours, totalTime.minutes, totalTime.seconds);

		allowed_speedContainer.innerHTML = 50; //TODO woher
		name_of_streetContainer.innerHTML = "Alteburgstraße"; //TODO woher
		remaining_distance_to_next_actionContainer.innerHTML = 5.4; //TODO woher
		name_of_actionContainer.innerHTML = "gerade aus"; //TODO woher
		


	});


	//map the routing steps to custom div
	// var routingControlContainer = routing.getContainer();
	// var controlContainerParent = routingControlContainer.parentNode;
	// controlContainerParent.removeChild(routingControlContainer);
	// var itineraryDiv = document.getElementById('coming-up-direction');
	// itineraryDiv.appendChild(routingControlContainer);
	
	

}


function secondsToHm(d) {
	d = Number(d);
	const h = Math.floor(d / 3600);
	const m = Math.floor(d % 3600 / 60);
	const s = Math.floor(d);
	var res = {
		hours: h,
		minutes: m, 
		seconds: s
	}
	return res;
}


function formatDuration(hours, minutes, seconds) {
	if (hours == 0 && minutes != 0) {
		return minutes + " min";
	} else if (hours == 0 && minutes < 10) {
		return minutes + ":" + seconds + " s";
	} else {
		return hours + ":" + minutes + " h";
	}
}


function getDate(hours, minutes, seconds) {
	var date = new Date();
	var h = date.getHours();
	var m = date.getMinutes();
	var s = date.getSeconds();

	h = h + hours;
	m = m + minutes;
	if (m > 59) {
		h++;
		m = m - 60;
	}
	s = s + seconds; 
	if (s > 59) {
		m++;
		s = s - 60;
		if (m > 59) {
			h++;
			m = m - 60;
		}
	}
	return(h + ":" + m + " Uhr");

}