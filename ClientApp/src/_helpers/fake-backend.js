import { Role } from './role'; 

export function configureFakeBackend() {
    let users = [
        { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
        { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User }
    ];

    let realFetch = window.fetch; 
    window.fetch = function (url, opts) {
        const authHeader = opts.headers['Authorization'];
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');
        const roleString = isLoggedIn && authHeader.split('.')[1];
        const role = roleString ? Role[roleString] : null;
        console.log(url); 
        return new Promise((resolve, reject) => { 
            setTimeout(() => {
                if (url.endsWith('users/authenticate')) {
                    console.log('ehhh'); 
                    return ok({
                        name: 'bob'
                    }); 
                }

                console.log('hmmm'); 
                realFetch(url, opts).then(response => resolve(response)); 

                function ok(body) {
                    resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) })
                    //resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) })
                }
            }, 500); 
        })
    }
}