let likes = []
let cart = []
let workId
const galleryApp = new WorksApiHandler()
let isClick = true


//Funcion para los likes

function getIdFavorites(id) {
    likes.push(id)
    document.querySelector('#like-btn')
    if (likes.length > 1) likes.shift()
    galleryApp
        .getLikes(likes)

}

//Funcion para la tienda

function putInCart(id) {
    cambiarColor(id)
    cart.push(id)
    if (cart.length > 1) cart.shift()
    galleryApp
        .getCart(cart)
}


//función para cambiar de imagen al pulsar el corazón de Me gusta
function changeColor(id) {
    isClick == true ? document.getElementById(id).src = "/images/blackheart.png" : document.getElementById(id).src = "/images/redheart.png"
}


//Función para colorear los corazones 
function colorearCorazones() {
    galleryApp.getCurrentUser()
        .then(response => {
            const heartLikes = response.data[0].likes

            heartLikes.forEach(elem => {
                document.getElementById(elem).src = "/images/redheart.png"
            })
        })
        .catch(err => next(err))
}

window.onload = () => {

    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    const galleryApp = new WorksApiHandler();
    const parameters = window.location.pathname.split("/");
    const id = parameters[parameters.length - 1];
    galleryApp
        .getWorksFromUser(id)
        .then((response) => {
            html2 = "";
            shuffle(response.data);
            response.data.forEach((elm) => {
                colorearCorazones()
                html2 += `<div class="containerIndex col-sm-4">
                             <div class="containerLike">
                             <a href="/works/details/${elm._id}"><img class="indexImage" src="${elm.imageUrl}" alt="imagen"></a>
                            <a id="price-btn" data-toggle="modal" data-target="#exampleModalLong" onClick="putInCart('${elm._id}')" class="btn"> ${elm.price}€</a>
                             <a id="like-btn"><img id="${elm._id}" onClick="getIdFavorites('${elm._id}')" class="btn btn-heart" src="/images/blackheart.png" alt="boton de like"></a>
                            </div> 
                             <h3>${elm.title}</h3>
                            <p class="workDescription">${elm.description}</p>
                          </div>`;
            });
            document.querySelector("#worksuser").innerHTML = html2;
        })
        .catch((err) => console.log(err));





}