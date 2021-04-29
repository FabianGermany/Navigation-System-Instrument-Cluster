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

import * as leaflet from './leaflet/leaflet';
import * as map from './js/map'
// import * as compass from './compass/leaflet-compass'; //this delivers an compile time error...

/* CSS */
import './styles/app.scss';
import './leaflet/leaflet.css';
import './compass/leaflet-compass.css';


window.app = app;

api.init();

$.ajax({
    url: app.init(),
    success: function() {
        map.init();
    }
});