

       window.onload = () => {
            axios.get('http://localhost:3000/works/api')
                 .then(response => {
                    html = ''
                    console.log("-------------",response.data)
                    shuffle(response.data)
                    response.data.forEach(elm => 
                           html += `<div class="col-sm-4">
                                    <a href="/works/details/${elm._id}"><img class="indexImage" src="${elm.imageUrl}" alt="imagen"></a>
                                     <h3>${elm.title}</h3>
                                    <p>${elm.description}</p>
                                    <p> Artista: <a href="/users/profile/${elm.user._id}">${elm.user.username}</p></a>
                                    <p>${elm.price}€</p>
                            </div>`)
                    document.querySelector('#works').innerHTML = html
                    console.log(document.querySelector('#location'))
                })
        }



        document.querySelector('#worksField').onkeyup = () => {
            const searchName=document.querySelector('#worksField').value
           // console.log(title.charAt(0).toUpperCase() + title)
           // console.log(location)
            console.log(searchName.charAt(0).toLowerCase())
        
            axios.get(`http://localhost:3000/works/api/tags/${searchName}`)
                     .then(response => {
                        html = ''
                        console.log("Response------------------",response.data)
                        shuffle(response.data)
                        response.data.forEach(elm => 
                               html += `<div class="col-sm-4">
                                        <a href="/works/details/${elm._id}"><img class="indexImage" src="${elm.imageUrl}" alt="imagen"></a>
                                         <h3>${elm.title}</h3>
                                        <p>${elm.description}</p>
                                        <p> Artista: <a href="/users/profile/${elm.user._id}">${elm.user.username}</p></a>
                                        <p>${elm.price}€</p>
                                </div>`)
                        document.querySelector('#works').innerHTML = html
                    })
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



 