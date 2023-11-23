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
        votelink = "https://voter.figgyc.uk/#votelink3=%09%09";

        for (e = 0; e < selected_entries.length; e++) {
            let entry_n = parseInt(selected_entries[e]) - 1;
            let div_code = "<tr><th class='letter'>" + alphabet[e] + "</th><th class='response'>" + entry_list[entry_n] + "</th></tr>"
            document.getElementById("screen").innerHTML += div_code;

            votelink += encodeURI(alphabet[e]);
            votelink += "%09";
            votelink += encodeURI(entry_list[entry_n]);

            if (e < selected_entries.length - 1) {
                votelink += "%0A";
            }
        }

        document.getElementById("votelink").setAttribute("href", votelink);
    })
}