const slides = document.querySelector(".slides");

const db = firebase.database();
const prosjekter = db.ref("prosjekter");


function visProsjekt(snap) {

    const prosjekt = snap.val();

    slides.innerHTML += `
        <li>
            <div class="col-md-6">
            <div class="avatar"> <img src="${ prosjekt.bilder[0].url }" alt="${ prosjekt.bilder[0].tekst }" class="img-responsive"> </div>
            </div>
            <div class="col-md-6">
            <blockquote>
                <h1>${ (prosjekt.kunde).toUpperCase() }</h1>
                <h4>${ prosjekt.kategori }</h4>
                <p>${ prosjekt.beskrivelse } </p>
                <a href="${ prosjekt.url }">Les mer</a>
            </blockquote>
            </div>
        </li>
    `;

}


prosjekter.on("child_added", visProsjekt);

// Sjekk om dette er lurt!
setTimeout( function() {
    $('.flexslider').flexslider({
        animation: "fade",
        directionNav: false,
    });
}, 1000 );

