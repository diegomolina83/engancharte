class WorksApiHandler {

        constructor() {
                this.app = axios.create({
                        baseURL: 'http://localhost:3000/api'
                })
        }

        getWorks = searchName => this.app.get(`/works/tags/${searchName}`)
        getWorksIndex = () => this.app.get('/works')
        getLikes = (newLike) => this.app.post('/users/likes', {
                likes: newLike
        })


}










