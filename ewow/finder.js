let episode = "2A";
let start = [7, 8];
let frames_per = 5;

window.onkeydown = function(event) {  
    if(event.key === "Enter") {  
        search();
    }
}

window.onload = function() {
    let ep_text = document.getElementById("episode");

    ep_text.textContent = "EWOW " + episode;
}

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
    let h_status = document.getElementById("h");

    status.textContent = "Searching responses... this may take a few seconds."
    h_status.textContent = ""

    let highlighters = document.querySelectorAll('[id^="high_"]');

    for (h = 0; h < highlighters.length; h++) {
        highlighters[h].remove();
    }

    let API = "https://script.google.com/macros/s/AKfycbyzlUz28TuWmYgf8vMG74qbBrpWsQmFXAcKp7dB3SWalcnOBeMHKYxPFdqfh0hJOqo/exec"

    fetch(API + "?key=" + encodeURI(key), 
    {
        redirect: "follow",
        method: "GET",
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        }
    })
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

        status.textContent = "Here are a few screens that match your search terms! (max. 5 screens)";
        h_status.textContent = "Hover over a screen to see its corresponding video timestamp!";

        for (n = 0; n < Math.max(5, key_list.length); n++) {
            let img = document.getElementById("i"+n);

            if (n < key_list.length) {
                removeClass(img, "nodisplay");
                img.src = "images/" + key_list[n][0].toString() + ".jpg";

                let total_seconds = Math.floor(start[0]*60 + start[1] + 1.00483 * key_list[n][0] * frames_per / 30);
                
                let min = Math.floor(total_seconds / 60);
                let sec = total_seconds % 60;

                if (sec.toString().length == 1) {
                    sec = "0" + sec.toString();
                }

                img.title = "Approximate video timestamp: " + min + ":" + sec;   

                for (r = 0; r < key_list[n][1].length; r++) {
                    let r_index = key_list[n][1][r];
    
                    img.insertAdjacentHTML("afterend",
                    '<img id="high_'+n+'_'+r+'" src="highlighter.png" class="highlight" style="bottom: '+(37+34.5*(11-r_index))+'px;">');
                }

            } else {
                addClass(img, "nodisplay");
            }
        }
        
        removeClass(button, "searching");
        removeClass(imgs, "nodisplay");
    })
    .catch((error) => {
        status.textContent = "An error has occurred searching for responses!";
        removeClass(button, "searching");
        console.log(error);
    })
}