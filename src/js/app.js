import { load as load_template } from './templates';
import Mustache from 'mustache';

import { lowcan } from 'agl-js-api';

var template;
var page = {
    speed: 0,
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
        value: 0,
        percent: 0
    },
    isWarning: true,
    fuel: {
        percent: 75,
        level: 14,
        range: 650,
        avg: 25.5
    }
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