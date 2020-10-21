class WorksApiHandler {

    constructor() {
        this.app = axios.create({
            baseURL: 'http://localhost:3000/api'
            // baseURL: 'https://engancharte.herokuapp.com/api'
        })
    }

    getWorks = searchName => this.app.get(`/works/tags/${searchName}`)
    getWorksFromUser = userId => this.app.get(`/works/${userId}`)
    getWorksIndex = () => this.app.get('/works')
    getLikes = (newLike) => this.app.post('/users/likes', { likes: newLike })
    getCart = (newInCart) => {
        this.app.post('/users/cart', { cart: newInCart })
            .then(req => console.log(req))
            .catch(err => console.log(err))
    }
    deleteItemFromCart = (deleteItem) => {
        this.app.post('/users/cart/delete', { cart: deleteItem })
            .then(req => console.log(req))
            .catch(err => console.log(err))
    }
    getCurrentUser = () => this.app.get('/currentuser')

    getLocation = (workId) => this.app.get(`/location/${workId}`)

}















