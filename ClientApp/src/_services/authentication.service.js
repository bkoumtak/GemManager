import { BehaviorSubject } from 'rxjs'; 
import { handleResponse } from '../_helpers/handle-response';

const currentUser = localStorage.getItem('currentUser');
const currentUserSubject = currentUser !== "undefined" ? new BehaviorSubject(JSON.parse(currentUser)) : new BehaviorSubject();

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
        .then(user => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        })
        .catch((error) => {
            alert(error);
        });
}