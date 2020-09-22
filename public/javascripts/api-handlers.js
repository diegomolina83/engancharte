class WorksApiHandler {

        constructor() {
                this.app = axios.create({
                        baseURL: 'http://localhost:3000/works/api'
                })
        }

        getWorks = searchName => this.app.get(`/tags/${searchName}`)
        getWorksIndex = () => this.app.get()


}










