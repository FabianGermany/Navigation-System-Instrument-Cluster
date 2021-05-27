// import * as lrm from '../leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine'; //import this because we need the data from there
// import './leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine';
// import { our_text } from '../leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine'
// import { our_image } from '../leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine'
// import { our_distance } from '../leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine'
// import { _createItineraryContainer } from '../leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine'


/*Global Variables so they are visible inside multiple functions*/
var mapcontainer;
var ETAContainer;
var remainingdurationContainer;
var distanceContainer;
var allowed_speedContainer;
var name_of_streetContainer;
var map;
var deg;
var compass;
var coord;
var instr;
var nextStepCoords = null;
var currentLocation;
var destinationLocation;
var zoom_Level = 19;
var startIcon;
var destinationIcon;
var startMarker, destinationMarker;
var tileUrl;
var attr;
var remaining_distance_to_next_actionContainer;
var name_of_actionContainer;
var PictureNavigationContainer;
var route;
var txt; //instruction text
var dis, dis_formatted; //distance
var ic; //icon text
var roadName; //name of road
var PictureNavigationContainer; //container for icon
var formatter;
var testMarker;
var routes; 
var summary;
var totalTime;
		

export function init() {

	mapcontainer = document.getElementById('mapid');
	ETAContainer = document.getElementById('ETA');
	remainingdurationContainer = document.getElementById('remaining_duration');
	distanceContainer = document.getElementById('distance');
	allowed_speedContainer = document.getElementById('allowed_speed');
	name_of_streetContainer = document.getElementById('name_of_street');
	compass = document.getElementById('compass_static');
	remaining_distance_to_next_actionContainer = document.getElementById('remaining_distance_to_next_action');
	name_of_actionContainer = document.getElementById('name_of_action'); 
	PictureNavigationContainer = document.getElementById('PictureNavigation');

	tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';
	//alternatives: 
	//https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png 
	//https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png
	//https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png


    attr = 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';
	//alternatives:
	//'Map data &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'

	// custom marker-icon
	startIcon = new L.icon({
		iconUrl: '../images/marker.png',

		iconSize: [60, 60],
		iconAnchor: [30, 30],
		popupAnchor: [-3, -76]
	});

	destinationIcon = new L.icon({
		iconUrl: '../images/destination.png',

		iconSize: [62, 62],
		iconAnchor: [14, 62],
	});

	currentLocation = { //Reutlingen
		lon: 9.20427,
		lat: 48.49144
	}

	destinationLocation = { //Stuttgart
		lon: 9.192,
		lat: 48.783
	}

	//launch map
	launchMap();

	//Routing service
	routingPerformer();

}



 export function update() { //update map in endless loop 
	//TODO later change to subscription https://github.com/walzert/agl-js-api/blob/master/src/low-can.js
	//https://git.automotivelinux.org/apps/agl-service-navigation/about/

		var intervalId = setInterval(function() {
			//allowed_speedContainer.innerHTML = 50 + Math.floor(Math.random() * 50);
			//alert("Update");

			currentLocation = { //Reutlingen
				lon: 9.20427 + (Math.random() * 0.1),
				lat: 48.49144 + (Math.random() * 0.1)
			}
		
			destinationLocation = { //Stuttgart
				lon: 9.192,
				lat: 48.783
			}
		
			//Routing service
			routingPerformer();
		
			console.log("Map update done."); 
		  }, 6000);
 }


 


//different sub-functions
//***********************************************/

function launchMap() {
	// setup map position and zoom (if html div loaded properly)
	if (mapcontainer) {
		map = L.map(mapcontainer, {zoomControl: false, rotate: true}) //rotate true for rotate function
			.setView(currentLocation, zoom_Level);

		// add the OpenStreetMap tiles; TOOD maybe change to CartoDB tiles
		L.tileLayer(tileUrl, {
			maxZoom: 20,
			attribution: attr
		}).addTo(map);


		// show the scale bar on the lower left corner
		// L.control.scale().addTo(map);

	} else {
		console.log("Konnte div nicht finden");
	}
	
}


function routingPerformer() {
	route = L.Routing.control({
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

		
	route.hide(); //dont show the instruction box, only the route itself
	//route.show();


	//show routing stuff like instruction text, icon and meter amount
	route.on('routeselected', function(e) {
		coord = e.route.coordinates;
		instr = e.route.instructions;
		nextStepCoords = getNextStepCoords(instr, coord);
		formatter = new L.Routing.Formatter();

		deg = getAngle(currentLocation, nextStepCoords);

		testMarker = new L.marker(nextStepCoords, {icon: startIcon}).addTo(map);
		testMarker.setOpacity(0);
		startMarker.setLatLng(currentLocation);

		//auto-rotate map
		map.setBearing(360 - deg);
		compass.style.transform = 'rotate(' + (360 - deg) + 'deg)';

		txt = formatter.formatInstruction(instr[1]); //choose 1st element, not 0th, because the first one is always "go to XXX street" without icon!
		name_of_actionContainer.innerHTML = txt;

		dis = instr[1].distance;
		dis_formatted = formatter.formatDistance(dis); //format dis into a better string with unit
		remaining_distance_to_next_actionContainer.innerHTML = dis_formatted; //TODO get_our_distance(); //

		//roadName = formatter.formatInstruction(instr.road[0]);
		ic =  formatter.getIconName(instr[1]);

		iconHandler(ic, PictureNavigationContainer); //icon choice


		//calculate distance

		// var g = {
		// 	"type": "Point",
		// 	"coordinates": [coord[instr[0].index].lng, coord[instr[0].index].lat]
		// 	};
		//console.log(p)
		//L.geoJson(getInstrGeoJson(instr,coord), {onEachFeature: onEach}).addTo(map);

	  });
	  


	//setup arrival time, duration & distance 
	route.on('routesfound', function(e) {
		routes = e.routes;
		summary = routes[0].summary;
		totalTime = secondsToHm(summary.totalTime);
		
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

		allowed_speedContainer.innerHTML = 50; //hard to get for free...no suitable API
		name_of_streetContainer.innerHTML = "Alteburgstraße"; //also too hard for first iteration
	});
}





function iconHandler(ic, container) {
	//first reset icons
	container.classList.remove("icon-class");
	container.classList.remove("icon-continue");
	container.classList.remove("icon-sharpright");
	container.classList.remove("icon-turnright");
	container.classList.remove("icon-bearright");
	container.classList.remove("icon-uturn");
	container.classList.remove("icon-sharpleft");
	container.classList.remove("icon-turnleft");
	container.classList.remove("icon-bearleft");
	container.classList.remove("icon-roundabout");

	//load suitable icon and send CAN signal for LED stuff
	if (ic == 'continue'){		 	
		container.classList.add("icon-class");
		container.classList.add("icon-continue");
		//TODO CAN signal......
	}
	else if (ic == 'enter-roundabout'){		 	
		container.classList.add("icon-class");
		container.classList.add("icon-roundabout");
	}
	else if (ic == 'bear-right'){		 	
		container.classList.add("icon-class");
		container.classList.add("icon-bearright");
	}
	else if (ic == 'turn-right'){		 	
		container.classList.add("icon-class");
		container.classList.add("icon-turnright");
	}
	else if (ic == 'sharp-right'){		 	
		container.classList.add("icon-class");
		container.classList.add("icon-sharpright");
	}
	else if (ic == 'u-turn'){
		container.classList.add("icon-class");
		container.classList.add("icon-uturn");
	}
	else if (ic == 'sharp-left'){		 	
		container.classList.add("icon-class");
		container.classList.add("icon-sharpleft");
	}
	else if (ic == 'turn-left'){		 	
		container.classList.add("icon-class");
		container.classList.add("icon-turnleft");
	}
	else if (ic == 'bear-left'){		 	
		container.classList.add("icon-class");
		container.classList.add("icon-bearleft");
	}
	else // (ic == '....')
	{
		console.log("error");
	}
}


function getInstrGeoJson(instr,allCoords) {
	var formatter = new L.Routing.Formatter();
	var instrPts = {
		type: "FeatureCollection",
		features: []
	};
	for (var i = 0; i < instr.length; ++i) {
		var g = {
			"type": "Point",
			"coordinates": [allCoords[instr[i].index].lng, allCoords[instr[i].index].lat]
		  };
		var p = {
			"instruction": formatter.formatInstruction(instr[i])
		  };
		instrPts.features.push({
			"geometry": g,
			"type": "Feature",
			"properties": p
		  });
	}
	console.log(instrPts);

	return instrPts;
}

function getNextStepCoords(instr, allCoords) {
	var arrayLen = instr.length; //if 16: 0...15
	if (arrayLen >= 3){
		var res = {
			lon : allCoords[instr[2].index].lng,
			lat : allCoords[instr[2].index].lat
		};
	}
	else if (arrayLen == 2){
		var res = {
			lon : allCoords[instr[1].index].lng,
			lat : allCoords[instr[1].index].lat
		};
	}
	else if (arrayLen == 1){
		var res = {
			lon : allCoords[instr[0].index].lng,
			lat : allCoords[instr[0].index].lat
		};
	}
	else { //no element
		//houston we have a problem
	}

	return res;
}



function getAngle(A, B){
	var angle = null;
	var latA = A.lat;
	var lonA = A.lon;
	var latB = B.lat;
	var lonB = B.lon;

	// 注意经度或者纬度相等 (when longitude or latitude is equal)
	if(lonA == lonB && latA>latB ){
		angle = Math.PI;
	}
	else if(lonA == lonB && latA < latB ){
		angle = 0	;
	}
	else if(lonA > lonB && latA == latB ){
		angle = -(Math.PI/2);
	}
	else if(lonA < lonB && latA == latB ){
		angle = Math.PI/2	;
	}

	// 注意经度或者纬度都不相等 (Longitude and latitude are not equal)
	else{
		var x1 = A.lat*Math.pow(10,12);
		var x2 = B.lat*Math.pow(10,12);
		var y1 = A.lon*Math.pow(10,12);
		var y2 = B.lon*Math.pow(10,12);
		angle = Math.atan2(y2-y1,x2-x1)
	}

	angle = angle / (2 * Math.PI) * 360;
	// angle = 360 - angle;

	return angle;
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