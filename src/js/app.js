import { load as load_template } from './templates';
import Mustache from 'mustache';

import { lowcan } from 'agl-js-api';

var template;
var page = {
    speed: 50,
    tires: {
        front: {
            left: 21,
            right: 22
        },
        rear: {
            left: 23,
            right: 24
        }
    },
    rpm: {
        value: 2400,
        percent: 0
    },
    isWarning: true,
    fuel: {
        percent: 75,
        level: 48,
        range: 650,
        avg: 25.5
    },

    /*this should come from API...*/
    ETA: "4:45 AM",
    remaining_duration: "1:39 h" /*todo special format for time in hr, min etc.*/,
    distance: 81,
    allowed_speed: 50,
    name_of_street: "Alteburgstraße",
    remaining_distance_to_next_action: 5.4,
    name_of_action: "gerade aus"
};

export function show() {
    document.body.innerHTML = Mustache.render(template, page);
}

export function init() {

    lowcan.list().then( function( result ) {
        console.log(result.length);
        for( var i=0;i<result.length; i++) {
            if( result[i].startsWith('messages') ) {
                (function(event) {
                    lowcan.get(event).then( function( result ) {
                        console.log(result[0].event, result[0].value);
                    }, function(error){
                        console.error(event, error);
                    });
                })(result[i]);
            }
        }
    }, function(error){
        console.error(error);
    });

    load_template('main.template.html').then(function(result) {
        template = result;
        Mustache.parse(template);
        show();
    }, function(error) {
        console.error('ERRROR loading main template', error);
    });
}

export function simulate() {
    console.log('SIMULATE');
    var counter = 0;
    var interval = setInterval(function() {
        counter ++;
        if( page.speed < 60 ) {
            page.speed += Math.floor(Math.random()*10);
            if( page.rpm.percent < 80 ) {
                page.rpm.percent += Math.floor(Math.random()*25);
            } else {
                page.rpm.percent = 40;
            }
        } else if (Math.random() > 0.5 ) {
            page.speed += Math.floor(Math.random()*10);
            page.rpm.percent = Math.min(80, Math.floor(Math.random()*90));
        } else {
            page.speed -= Math.floor(Math.random()*10);
            page.rpm.percent = Math.min(80, Math.floor(Math.random()*90));
        }

        show();

        if( counter > 600 ) {
            clearInterval(interval);
        }
    }, 1000);
}

export function initMap() {
	var mapcontainer = document.getElementById('mapid');
	if (mapcontainer) {
		var map = L.map(mapcontainer).setView({lon: 0, lat: 0}, 2);

		// add the OpenStreetMap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
		}).addTo(map);

		// show the scale bar on the lower left corner
		// L.control.scale().addTo(map);

		// show a marker on the map
		L.marker({lon: 0, lat: 0}).bindPopup('The center of the world').addTo(map);

        // add compass
		var comp = new L.Control.Compass({autoActive: true, showDigit:true});
		map.addControl(comp);


	} else {
		console.log("Konnte div nicht finden");
	}
}