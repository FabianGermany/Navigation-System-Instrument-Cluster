export function load(template) {
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();

        xhr.open('GET', '/templates/'+template);
    
        xhr.send();
    
        xhr.onload = function() {
            if (xhr.status != 200) {
                console.error('Error loading template', xhr.status, xhr.statusText);
                reject(xhr.status);
            } else {
                console.log(xhr.responseType);
                resolve(xhr.responseText);
            }
        };
    });
}