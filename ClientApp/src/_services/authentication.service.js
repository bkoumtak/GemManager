import { BehaviorSubject } from 'rxjs'; 
import { handleResponse } from '../_helpers/handle-response';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
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

function logout() {
    localStorage.removeItem('currentUser'); 
    currentUserSubject.next(null); 
}