let likes = []
let cart = []
const galleryApp = new WorksApiHandler()
let id
document.querySelector('#worksField').onkeyup = () => {

    const searchName = document.querySelector('#worksField').value
    galleryApp
        .getWorks(searchName)
        .then(response => {
            html = ''
            shuffle(response.data)
            response.data.forEach(elm =>
                html += `<div class="containerIndex col-sm-4">
                             <div class="containerLike">
                             <p ><a class="nameCard" href="/users/profile/${elm.user._id}"><img class="imageUserLittle" src="${elm.user.imageUrl}" alt="">${elm.user.username}</p></a>
                            <a href="/works/details/${elm._id}"><img class="indexImage" src="${elm.imageUrl}" alt="imagen"></a>
                             <a id="price-btn" onClick="putInCart('${elm._id}')" class="btn"> ${elm.price}€</a>
                             <a id="like-btn"><img onClick="getIdFavorites('${elm._id}')" class="btn" src="/images/NicePng_balloon-png_23089.png" alt="boton de like"></a>
                            </div> 
                             <h3>${elm.title}</h3>
                            <p class="workDescription">${elm.description}</p>
                          </div>`)
            document.querySelector('#works').innerHTML = html
        })
        .catch(err => console.log(err))
}


window.onload = () => {

    galleryApp
        .getWorksIndex()
        .then(response => {
            html = ''
            shuffle(response.data)
            console.log(response.data)
            response.data.forEach(elm => {
                // coloredLikes(elm)
                html += `<div class="containerIndex col-sm-4">
                             <div class="containerLike">
                             <p ><a class="nameCard" href="/users/profile/${elm.user._id}"><img class="imageUserLittle" src="${elm.user.imageUrl}" alt="">${elm.user.username}</p></a>
                            <a href="/works/details/${elm._id}"><img class="indexImage" src="${elm.imageUrl}" alt="imagen"></a>
                             <a id="price-btn" onClick="putInCart('${elm._id}')" class="btn"> ${elm.price}€</a>
                             <a id="like-btn"><img onClick="getIdFavorites('${elm._id}')" class="btn" src="/images/NicePng_balloon-png_23089.png" alt="boton de like"></a>
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
    likes.push(id)
    document.querySelector('#like-btn')
    if (likes.length > 1) likes.shift()
    galleryApp
        .getLikes(likes)

}


//Funcion para la tienda

function putInCart(id) {
    cart.push(id)
    console.log(".......................",cart)
    galleryApp
        .getCart(cart)
}




// function coloredLikes(elem) {
//     console.log("Esto viene de coloredLikes:", elem)
//     galleryApp.
//         getUserAndCompareLikes(elem)
//         .then(user => {

//             user.data.forEach(element => {
//                 console.log(element)
//             });

//         })
// }


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
