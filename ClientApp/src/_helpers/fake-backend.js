import { Role } from './role'; 

export function configureFakeBackend() {
    let users = [
        { id: 1, username: 'bkoumtak', password: 'bkoumtak', firstName: 'Ace', lastName: 'Koumtakoun', role: Role.Admin },
        { id: 2, username: 'hauche', password: 'hauche', firstName: 'Hau', lastName: 'Gilles Che', role: Role.User }
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
                    const params = JSON.parse(opts.body); 
                    const user = users.find(x => x.username === params.username && x.password === params.password); 
                    if (!user) return error('Username or password is incorrect'); 
                    return ok({
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        token: `fake-jwt-token.${user.role}`
                    }); 
                }

                console.log('hmmm'); 
                realFetch(url, opts).then(response => resolve(response)); 

                function ok(body) {
                    resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) })
                    //resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) })
                }

                function error(message) {
                    resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) })
                }
            }, 500); 
        })
    }
}