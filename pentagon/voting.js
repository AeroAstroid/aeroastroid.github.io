const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const urlParams = new URLSearchParams(window.location.search);
let screen = urlParams.get("screen");

if (screen != null) {
    let selected_entries = urlParams.get("screen").split("/");
    let entry_list;

    fetch('entries.txt')
    .then(r => r.text())
    .then(text => {
        entry_list = text.split("\n");

        for (e = 0; e < selected_entries.length; e++) {
            let entry_n = parseInt(selected_entries[e]) - 1;
            let div_code = "<tr><th class='letter'>" + alphabet[e] + "</th><th>" + entry_list[entry_n] + "</th></tr>"
            document.getElementById("screen").innerHTML += div_code;
        }
    })
}