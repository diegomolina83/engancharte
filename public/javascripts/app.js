let likes = []
const galleryApp = new WorksApiHandler()

// document.querySelector('#worksField').onkeyup = () => {

//     const searchName = document.querySelector('#worksField').value
//     galleryApp
//         .getWorks(searchName)
//         .then(response => {
//             html = ''
//             shuffle(response.data)
//             response.data.forEach(elm =>
//                 html += `<div class="col-sm-4">
//                             <div class="containerLike">
//                             <a href="/works/details/${elm._id}"><img class="indexImage" src="${elm.imageUrl}" alt="imagen"></a>
//                              <a href="/works/like/${elm._id}"><button id="like-btn" class="btn"></button></a>
//                             </div> 
//                             <h3>${elm.title}</h3>
//                             <p>${elm.description}</p>
//                             <p> Artista: <a href="/users/profile/${elm.user._id}">${elm.user.username}</p></a>
//                             <p>${elm.price}€</p>
//                          </div>`)
//             document.querySelector('#works').innerHTML = html
//         })
//         .catch(err => next(err))
// }


// window.onload = () => {

//     galleryApp
//         .getWorksIndex()
//         .then(response => {
//             html = ''
//             shuffle(response.data)
//             response.data.forEach(elm =>
//                 html += `<div class="col-sm-4">
//                              <div class="containerLike">
//                             <a href="/works/details/${elm._id}"><img class="indexImage" src="${elm.imageUrl}" alt="imagen"></a>
//                             <a href="/works/like/${elm._id}"><button id="like-btn" class="btn"></button></a>
//                             </div> 
//                              <h3>${elm.title}</h3>
//                             <p>${elm.description}</p>
//                             <p>Artista: <a href="/users/profile/${elm.user._id}">${elm.user.username}</p></a>
//                             <p>Precio: ${elm.price}€</p>
//                           </div>`)
//             document.querySelector('#works').innerHTML = html
//         })
//         .catch(err => next(err))
// }

// document.getElementById('like-btn').onclick = () => {
//     events.preventDefault()
//     alert("funciona")
//     // galleryApp
//     //     .getLikes()
//     //     .then(response => console.log(response.data))
// }

window.addEventListener("load", () => {
    galleryApp
        .getWorksIndex()
        .then(response => {
            html = ''
            shuffle(response.data)
            response.data.forEach(elm =>
                html += `<div class="col-sm-4">
                             <div class="containerLike">
                            <a href="/works/details/${elm._id}"><img class="indexImage" src="${elm.imageUrl}" alt="imagen"></a>
                            <a role="button" id="like-btn" class="btn" href="/works/like/${elm._id}"></a>
                            <button  id="boton"> Hola </button >
                            </div> 
                             <h3>${elm.title}</h3>
                            <p>${elm.description}</p>
                            <p>Artista: <a href="/users/profile/${elm.user._id}">${elm.user.username}</p></a>
                            <p>Precio: ${elm.price}€</p>
                          </div>`)
            document.querySelector('#works').innerHTML = html
        })
        .catch(err => next(err))
    // const botoncillo = document.querySelector(".container")
    // botoncillo.innerHTML +=`<button  id="boton"> Hola </button >`
        

    document.getElementById('boton').addEventListener("click", function (event) {
           
        
        alert("funciona")


    })

})


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
