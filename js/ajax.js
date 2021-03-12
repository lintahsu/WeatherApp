'use strict';

const ajax = {
    get(url) {
        return fetch(url).then(
            antwort => antwort.json()
        ).catch(
            console.log
        )
    },
    post(url, data) {
        const myRequest = new Request(
            url,
            {
                method: 'post',
                headers: { 'content-type': 'application/json' },
                body: data
            }
        )
        return fetch(myRequest).then(
            antwort => antwort.json()
        ).catch(
            console.log
        )
    }
}