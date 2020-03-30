import { BehaviorSubject } from 'rxjs'; 
import { handleResponse } from '../_helpers/handle-response';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};

function login() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }; 

    return fetch('api/user/auth', requestOptions)
        .then(handleResponse)
        .catch((error) => {
            alert(error);
        })
        .then(user => {
            localStorage.setItem('currentUser', JSON.stringify(user)); 
            currentUserSubject.next(user); 

            return user; 
        });
}