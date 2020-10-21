let likes = []
let cart = []
const galleryApp = new WorksApiHandler()
let workId
let isClick = true


window.onload = () => {
    
    galleryApp
        .getWorksIndex()
        .then(response => {
            html = ''
            shuffle(response.data)
            response.data.forEach(elm => {
                colorearCorazones()
                isclick=false
                html += `<div class="containerIndex col-sm-4">
                             <div class="containerLike">
                             <p ><a class="nameCard" href="/users/profile/${elm.user._id}"><img class="imageUserLittle" src="${elm.user.imageUrl}" alt="">${elm.user.username}</p></a>
                             <a href="/works/details/${elm._id}"><img class="indexImage" src="${elm.imageUrl}" alt="imagen"></a>
                             <a id="price-btn" data-toggle="modal" data-target="#exampleModalLong" onClick="putInCart('${elm._id}')" class="btn"> ${elm.price}€</a>
                             <a id="like-btn"><img id="${elm._id}" onClick="getIdFavorites('${elm._id}')" class="btn btn-heart" src="/images/blackheart.png" alt="boton de like"></a>
                            </div> 
                             <h3>${elm.title}</h3>
                            <p class="workDescription">${elm.description}</p>
                          </div>`})
            document.querySelector('#works').innerHTML = html
        })
        .catch(err => console.log(err))
}


document.querySelector('#worksField').onkeyup = () => {

    const searchName = document.querySelector('#worksField').value
    galleryApp
        .getWorks(searchName)
        .then(response => {
            html = ''
            shuffle(response.data)
            response.data.forEach(elm => {
                colorearCorazones()
                html += `<div class="containerIndex col-sm-4">
                             <div class="containerLike">
                             <p ><a class="nameCard" href="/users/profile/${elm.user._id}"><img class="imageUserLittle" src="${elm.user.imageUrl}" alt="">${elm.user.username}</p></a>
                             <a href="/works/details/${elm._id}"><img class="indexImage" src="${elm.imageUrl}" alt="imagen"></a>
                             <a id="price-btn" data-toggle="modal" data-target="#exampleModalLong" onClick="putInCart('${elm._id}')" class="btn"> ${elm.price}€</a>
                             <a id="like-btn"><img id="${elm._id}" onClick="getIdFavorites('${elm._id}')" class="btn btn-heart" src="/images/blackheart.png" alt="boton de like"></a>
                            </div> 
                             <h3>${elm.title}</h3>
                            <p class="workDescription">${elm.description}</p>
                          </div>`})
            document.querySelector('#works').innerHTML = html
        })
        .catch(err => console.log(err))
}


//Funcion para los likes
function getIdFavorites(id) {
    changeColor(id)
    likes.push(id)
    isClick = !isClick
    document.querySelector('#like-btn')
    if (likes.length > 1) likes.shift()
    galleryApp
        .getLikes(likes)

}

//función para cambiar de imagen al pulsar el corazón de Me gusta
function changeColor(id) {
    isClick == true ? document.getElementById(id).src = "/images/blackheart.png" : document.getElementById(id).src = "/images/redheart.png"
}


//Funcion para la tienda
function putInCart(id) {
    cart.push(id)
    if (cart.length > 1) cart.shift()
    galleryApp
        .getCart(cart)
}


//Función para colorear los corazones 
function colorearCorazones() {

    galleryApp.getCurrentUser()
        .then(response => {
            const heartLikes = response.data[0].likes

            heartLikes.forEach(elem => {
                document.getElementById(elem).src = "/images/redheart.png"
                isClick = !isClick
            })
        })
        .catch(err => next(err))
}


//Función para randomizar el array con las obras que se mostrarán en el index
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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
