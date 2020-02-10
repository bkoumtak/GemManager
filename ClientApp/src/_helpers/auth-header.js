import { authenticationService } from '../_services/authentication.service'; 

export function authHeader() {
    const currentUser = authenticationService.currentUserValue; 
    if (currentUser && currentUser.token) {
        return { Authorization: `Bearer ${currentUser.token}` };
    } else {
        return {}; 
    }
}