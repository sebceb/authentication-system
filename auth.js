export function signup(username, email, password) {
    //get users or make blank
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({username,
        email,
        password
    });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

export function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u=> u.email === email && u.password === password);

    if (user){
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    } return false
}

export function getCurrentUser(){
    const userJSON = localStorage.getItem('currentUser');
    return userJSON ? JSON.parse(userJSON) : null;
}

export function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'home.html';
}