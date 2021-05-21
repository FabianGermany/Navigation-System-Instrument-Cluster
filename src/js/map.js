// import * as lrm from '../leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine'; //import this because we need the data from there
// import './leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine';
// import { our_text } from '../leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine'
// import { our_image } from '../leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine'
// import { our_distance } from '../leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine'
// import { _createItineraryContainer } from '../leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine'

export function init() {


	/*Variables*/

	var mapcontainer = document.getElementById('mapid');

	var ETAContainer = document.getElementById('ETA');
	var remainingdurationContainer = document.getElementById('remaining_duration');
	var distanceContainer = document.getElementById('distance');

	var allowed_speedContainer = document.getElementById('allowed_speed');
	var name_of_streetContainer = document.getElementById('name_of_street');

	var map;

	var coord;
	var instr;

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
	var startIcon = new L.icon({
		iconUrl: '../images/marker.png',

		iconSize: [60, 60],
		iconAnchor: [30, 30],
		popupAnchor: [-3, -76]
	});
	var destinationIcon = new L.icon({
		iconUrl: '../images/destination.png',

		iconSize: [62, 62],
		iconAnchor: [14, 62],
	});

	var startMarker, destinationMarker;


	var tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';
	//alternatives: 
	//https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png 
	//https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png
	//https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png


    var attr = 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';
	//alternatives:
	//'Map data &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'

	// setup map position and zoom (if html div loaded properly)
	if (mapcontainer) {
		map = L.map(mapcontainer, {zoomControl: false, rotate: true}) //rotate true for rotate function
			.setView(currentLocation, zoom_Level);



		// add the OpenStreetMap tiles; TOOD maybe change to CartoDB tiles
		L.tileLayer(tileUrl, {
			maxZoom: 20,
			attribution: attr
		}).addTo(map);



		'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';
	//alternatives:
	//'Map data &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'

		// show the scale bar on the lower left corner
		// L.control.scale().addTo(map);
	
	} else {
		console.log("Konnte div nicht finden");
	}


	// Dynamic Compass doesnt work anymore; so we use static one
	//var comp = new L.Control.Compass({autoActive: true, showDigit:true, position:'bottomright'});
	//map.addControl(comp);

	var remaining_distance_to_next_actionContainer = document.getElementById('remaining_distance_to_next_action');
	var name_of_actionContainer = document.getElementById('name_of_action'); 
	var PictureNavigationContainer = document.getElementById('PictureNavigation');


	//auto-rotate map
	var deg = 50;
	var compass = document.getElementById('compass_static');
	map.setBearing(deg); // TODO
	compass.style.transform = 'rotate(' + deg + 'deg)';



	//Routing service
	var route = L.Routing.control({
		waypoints: [
			L.latLng(currentLocation.lat, currentLocation.lon), //Reutlingen
			L.latLng(destinationLocation.lat, destinationLocation.lon) //Stuttgart
		],
		createMarker: function(i, wp, nWps) {
			if (i === 0) {
				startMarker = L.marker(wp.latLng, {
					draggable: false,
					bounceOnAdd: true,
					bounceOnAddOptions: {
						duration: 1000,
						height: 800,
						function() {	
							(bindPopup(popup).openOn(map))
						}
					},
					icon: startIcon,
				});
				return startMarker;
			}
			else if (i === 0 || i === nWps - 1) {
				destinationMarker = L.marker(wp.latLng, {
					icon: destinationIcon,
				});
				return destinationMarker;
			} else {
				return null;
			}
		},


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
		language: 'de',
		showAlternatives: false,
			
		}).addTo(map);

	


					
	//route.hide(); //dont show the instruction box, only the route itself
	route.show();

	var txt; //instruction text
	var dur; //duration
	var ic; //icon text
	var roadName; //name of road
	var PictureNavigationContainer; //container for icon


	//show routing stuff like instruction text, icon and meter amount
	route.on('routeselected', function(e) {
		coord = e.route.coordinates;
		instr = e.route.instructions;
		var formatter = new L.Routing.Formatter();
		txt = formatter.formatInstruction(instr[1]); //choose 1st element, not 0th, because the first one is always "go to XXX street" without icon!
		dur =  formatter.formatDistance(instr[1]); //todo geht noch nicht
		ic =  formatter.getIconName(instr[1]); //todo geht noch nicht
		//roadName = formatter.formatInstruction(instr.road[0]);
		console.log(ic);

		//first reset icons
		PictureNavigationContainer.classList.remove("icon-class");
		PictureNavigationContainer.classList.remove("icon-continue");
		PictureNavigationContainer.classList.remove("icon-sharpright");
		PictureNavigationContainer.classList.remove("icon-turnright");
		PictureNavigationContainer.classList.remove("icon-bearright");
		PictureNavigationContainer.classList.remove("icon-uturn");
		PictureNavigationContainer.classList.remove("icon-sharpleft");
		PictureNavigationContainer.classList.remove("icon-turnleft");
		PictureNavigationContainer.classList.remove("icon-bearleft");
		PictureNavigationContainer.classList.remove("icon-roundabout");

		//load suitable icon
		if (ic == 'continue'){		 	
			PictureNavigationContainer = document.getElementById('PictureNavigation');
			PictureNavigationContainer.classList.add("icon-class");
			PictureNavigationContainer.classList.add("icon-continue");
		}
		else if (ic == 'enter-roundabout'){		 	
			PictureNavigationContainer = document.getElementById('PictureNavigation');
			PictureNavigationContainer.classList.add("icon-class");
			PictureNavigationContainer.classList.add("icon-roundabout");
		}
		else if (ic == 'bear-right'){		 	
			PictureNavigationContainer = document.getElementById('PictureNavigation');
			PictureNavigationContainer.classList.add("icon-class");
			PictureNavigationContainer.classList.add("icon-bearright");
		}
		else if (ic == 'turn-right'){		 	
			PictureNavigationContainer = document.getElementById('PictureNavigation');
			PictureNavigationContainer.classList.add("icon-class");
			PictureNavigationContainer.classList.add("icon-turnright");
		}
		else if (ic == 'sharp-right'){		 	
			PictureNavigationContainer = document.getElementById('PictureNavigation');
			PictureNavigationContainer.classList.add("icon-class");
			PictureNavigationContainer.classList.add("icon-sharpright");
		}
		else if (ic == 'u-turn'){
			PictureNavigationContainer = document.getElementById('PictureNavigation');
			PictureNavigationContainer.classList.add("icon-class");
		 	PictureNavigationContainer.classList.add("icon-uturn");
		}
		else if (ic == 'sharp-left'){		 	
			PictureNavigationContainer = document.getElementById('PictureNavigation');
			PictureNavigationContainer.classList.add("icon-class");
			PictureNavigationContainer.classList.add("icon-sharpleft");
		}
		else if (ic == 'turn-left'){		 	
			PictureNavigationContainer = document.getElementById('PictureNavigation');
			PictureNavigationContainer.classList.add("icon-class");
			PictureNavigationContainer.classList.add("icon-turnleft");
		}
		else if (ic == 'bear-left'){		 	
			PictureNavigationContainer = document.getElementById('PictureNavigation');
			PictureNavigationContainer.classList.add("icon-class");
			PictureNavigationContainer.classList.add("icon-bearleft");
		}
		else // (ic == '....')
		{
			console.log("error");
		}






		

		//todo icon

		// var g = {
		// 	"type": "Point",
		// 	"coordinates": [coord[instr[0].index].lng, coord[instr[0].index].lat]
		// 	};
		//console.log(p)
		//L.geoJson(getInstrGeoJson(instr,coord), {onEachFeature: onEach}).addTo(map);
		name_of_actionContainer.innerHTML = txt; //our_text; //TODO //get_our_text(); //
		//PictureNavigationContainer.innerHTML = ic; //TODO get_our_image(); //
		remaining_distance_to_next_actionContainer.innerHTML = dur; //TODO get_our_distance(); //
	  });
	  


	// var test = new L.Routing.ItineraryBuilder;
	// test.createContainer();
	// test.createStep(p);








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
	var res = "";

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

	if (m < 10) {
	 	res = h + ":0" + m + " Uhr";
	} else {
		res = h + ":" + m + " Uhr";
	}

	return res;
}