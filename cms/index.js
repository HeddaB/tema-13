// HTML-elementer
const skjemaBilder = document.querySelector("#skjemaBilder");
const skjemaInfo = document.querySelector("#skjemaInfo");
const inpBilde = document.querySelector("#inpBilde");
const infoBilde = document.querySelector("#infoBilde");
const inpKunde = document.querySelector("#inpKunde");
const inpKategori = document.querySelector("#inpKategori");
const taBeskrivelse = document.querySelector("#taBeskrivelse");
const inpURL = document.querySelector("#inpURL");
const ulBilder = document.querySelector("#ulBilder");
const infoOpplasting = document.querySelector("#infoOpplasting");

// Firebase
const db = firebase.database();
const storage = firebase.storage();

const prosjekter = db.ref("prosjekter");


// Et array til å lagre bildene før vi legger inn i databasen
const bilderSomSkalLastesOpp = [];


// En hjelpefunksjon som jeg fant på nett for å regne om filstørrelser
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }


 // Viser informasjon om bildet som skal lastes opp
 function visBildeinfo() {
    const bilde = inpBilde.files[0];

    
    const filnavn = bilde.name;
    const bytes = bilde.size;
    const storrelse = bytesToSize(bytes);

    infoBilde.innerText = filnavn + "  " + storrelse;
}


// Laster opp et bilde til storage og lagrer url og info i arrayet
function lastOppBilde(evt) {
    evt.preventDefault();
    overlay.style.display = "flex";

    const bilde = inpBilde.files[0];
    const filnavn = bilde.name;
    const lagringsPlass = storage.ref("mineprosjektbilder/" + (+new Date()) + filnavn);

    lagringsPlass.put(bilde)
        .then( opplastetBilde => opplastetBilde.ref.getDownloadURL() )
        .then ( url => {
            bilderSomSkalLastesOpp.push({
                url: url,
                tekst: inpTekst.value
            });

            console.log(bilderSomSkalLastesOpp);

            overlay.style.display = "none";
            const div = document.createElement("div");
            div.innerHTML = `
                <img src="./ikoner/icon-image-128.png">
                <span>${filnavn}</span>
            `;

            ulBilder.appendChild( div );
            div.animate([
                { transform: "translateX(-300px)" },
                { transform: "translateX(0)" }
            ], 500);

            let tekst = "bilde";
            if(bilderSomSkalLastesOpp.length > 1) {
                tekst = "bilder";
            }

            infoOpplasting.innerText = bilderSomSkalLastesOpp.length + " " + tekst + " er lastet opp";
            infoOpplasting.innerText = `${bilderSomSkalLastesOpp.length} ${tekst} er lastet opp`;

        } );

}

function lagreProsjekt(evt) {
    evt.preventDefault();

    prosjekter.push({
        bilder: bilderSomSkalLastesOpp,
        kunde: inpKunde.value,
        kategori: inpKategori.value,
        beskrivelse: taBeskrivelse.value,
        url: inpURL.value
    });

    skjemaInfo.reset();
    skjemaBilder.reset();
    bilderSomSkalLastesOpp.length = 0;
    infoOpplasting.innerText =  "Ingen bilder lastet opp ennå for dette prosjektet";
    ulBilder.innerHTML = ""; // Tar bort ikoner for opplastede bilder

}



skjemaInfo.addEventListener("submit", lagreProsjekt);

// Event Listeners
inpBilde.addEventListener("change", visBildeinfo);
skjemaBilder.addEventListener("submit", lastOppBilde);