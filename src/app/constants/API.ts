import { HttpHeaders } from "@angular/common/http"

const testApiUrl = 'http://localhost:8080';
const developmentUrl = 'https://server.adegarequinte.com.br';

const apiUrl = testApiUrl;

export const ApiUrls = {
    winesUrl: `${apiUrl}/wines`,
    usersUrl: `${apiUrl}/users`,
    ordersUrl: `${apiUrl}/orders`,
    addressesUrl: `${apiUrl}/addresses`,
    harmonizationsUrl: `${apiUrl}/harmonizations`,
    grapesUrl: `${apiUrl}/grapes`,
}

export const AuthorizationHeader = (): HttpHeaders => {
    let httpHeaders = new HttpHeaders();

    const authLStorage = localStorage.getItem('auth');
    if (authLStorage == null) return httpHeaders;

    return new HttpHeaders({
        'Authorization': 'Bearer ' + JSON.parse(authLStorage).token
    });
}