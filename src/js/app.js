import { load as load_template } from './templates';
import Mustache from 'mustache';

var template;
var page = {

};

export function show() {
    document.body.innerHTML = Mustache.render(template, page);
}

export function init() {
    load_template('main.template.html').then(function(result) {
        template = result;
        Mustache.parse(template);
        show();
    }, function(error) {
        console.error('ERRROR loading main template', error);
    });
}