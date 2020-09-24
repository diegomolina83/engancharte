let likes = []
let cart = []
let workId
const galleryApp = new WorksApiHandler()



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


//Funcion para cambiar el color de los corazones
function cambiarColor(id) {
    console.log("Obra añadida al carro")

}


function coloredLikes(elem,id) {
    console.log("Esto viene de coloredLikes:", elem,id)
    console.log(document.querySelector('#like-btn'))
    // galleryApp.
    //     getUserAndCompareLikes(elem)
    //     .then(user => {

    //         user.data.forEach(element => {
    //             console.log(element)
    //         });

    //     })
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
                coloredLikes(elm,id)
                console.log("-+-+-+-+-+-+-+-+-+-+ELM", elm);
                html2 += `<div class="containerIndex col-sm-4">
                             <div class="containerLike">
                             <a href="/works/details/${elm._id}"><img class="indexImage" src="${elm.imageUrl}" alt="imagen"></a>
                            <a id="price-btn" data-toggle="modal" data-target="#exampleModalLong" onClick="putInCart('${elm._id}')" class="btn"> ${elm.price}€</a>
                             <a id="like-btn"><img onClick="getIdFavorites('${elm._id}')" class="btn" src="/images/NicePng_balloon-png_23089.png" alt="boton de like"></a>
                            </div> 
                             <h3>${elm.title}</h3>
                            <p class="workDescription">${elm.description}</p>
                          </div>`;
            });
            document.querySelector("#worksuser").innerHTML = html2;
        })
        .catch((err) => console.log(err));




    
}