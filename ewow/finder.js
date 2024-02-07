function hasClass(ele,cls) {
return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
}
}

function updateButton() {
    let button = document.getElementById("s");
    let input = document.getElementById("i");

    if (!input.value) {
        addClass(button, "disabled");
    } else {
        removeClass(button, "disabled");
    }
}

function search() {
    let button = document.getElementById("s");
    let imgs = document.getElementById("images");
    let input = document.getElementById("i");

    if (hasClass(button, "disabled") || hasClass(button, "searching")) {
        return;
    }

    if (!input.value) {
        return;
    }

    let key = input.value;

    addClass(button, "searching");
    addClass(imgs, "nodisplay");

    let status = document.getElementById("status");
    status.textContent = "Searching responses... this may take a few seconds."

    let API = "https://script.google.com/macros/s/AKfycbyUltTGnXHq4S3agYcf5MW01Cv0QxBXxPXbs5zcxbmQhtVM3N6n7lgqAZ8gzgRw9G0/exec"

    fetch(API + "?key=" + encodeURI(key))
    .then(function(value) {
        return value.text();
    })
    .then(function(text){

        let key_list = JSON.parse(text);

        if (!key_list.length) {
            status.textContent = "No responses were found!";
            removeClass(button, "searching");
            return;
        }

        status.textContent = "Here are a few screens that match your search terms:";

        for (n = 0; n < Math.min(5, key_list.length); n++) {
            let img = document.getElementById("i"+n);

            img.src = "images/" + key_list[n].toString() + ".jpg";
        }

        removeClass(imgs, "nodisplay");
    })
    .catch((error) => {
        status.textContent = "An error has occurred searching for responses!";
        removeClass(button, "searching");
        console.log(error);
    })
}