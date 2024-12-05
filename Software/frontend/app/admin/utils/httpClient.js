'use client'
const baseUrl = "http://localhost:5000/api";

const httpClient = {
    get: (endpoint) => {
        let p = fetch(baseUrl + endpoint, {
            credentials: "include"
        })

        return p;
    },
    
    post: (endpoint, dados) => {
        let p = fetch(baseUrl + endpoint, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        })

        return p;
    },

    put: (endpoint, body) => {
        let p = fetch(baseUrl + endpoint, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        return p;
    },

    delete: (endpoint) => {
        let p = fetch(baseUrl + endpoint, {
            method: "DELETE",
            credentials: "include"
        })

        return p;
    }
}

export default httpClient;