import { authenticationService } from '../_services/authentication.service'; 

export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text); 
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                //authenticationService.logout(); 
                window.location.reload(true); 
            }

            let error = (data && data.message) || response.statusText; 

            if ([400].indexOf(response.status) !== -1) {
                window.location.reload(true);
                error = data;
            }

            return Promise.reject(error); 
        }

        return data; 
    }); 
}