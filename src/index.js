/*
 * Copyright 2019 Igalia, S.L.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* JS */
import * as app from './js/app';
import { api } from 'agl-js-api';

import './leaflet/leaflet'; //inside there is a special branch of leaflet for rotation: https://github.com/ronikar/Leaflet#readme
import * as map from './js/map';
import './leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine'; // routing machine for drawing route etc.
import './js/rotate-marker';
import './js/leaflet.rotatedMarker';

/* CSS */
import './styles/app.scss'; //import style sheets
import './leaflet/leaflet.css';
import './leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine.css';


var navigation_active = true; //TODO this value should be changed according to the Central Display unit via CAN (if the user presses on start or quit)

window.app = app;

api.init();


function initStuff(callback) {
    //console.log("Doing init of map...");
    $.ajax({
        url: map.init(),
        success: function() {
            //console.log("Map init done.");
            callback();
        }
    });
    
}

function updateStuff() {
    $.ajax({
        url: map.update(),
        success: function() {
            //console.log("Map update done."); 
        }
    });
    
}

//start the app itself if CAN message implies to start navigation
if (navigation_active){ //TODO start this every time when the Central Displays tell you to start a new navigation
    $.ajax({
        url: app.init(),
        success: function() {
            initStuff(updateStuff); //first init, then update using callback
        }
    });
    
}







