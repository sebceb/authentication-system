export const Storage = {
    saveCart: (cart) => {
        const user = Storage.getCurrentUser();
        if (user) localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
    },
    getCart: () => {
        const user = Storage.getCurrentUser();
        return user ? (JSON.parse(localStorage.getItem(`cart_${user.username}`)) || []) : [];
    },
    saveOrder: (order) => localStorage.setItem('latest_order', JSON.stringify(order)),
    getEmail: () => {
        const user = Storage.getCurrentUser();
        return user ? user.email : "guest@example.com";
    },
    getUsers: () => JSON.parse(localStorage.getItem('users')) || [],
    saveUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
    getCurrentUser: () => JSON.parse(localStorage.getItem('current_user')),
    setCurrentUser: (user) => {
        if (user) localStorage.setItem('current_user', JSON.stringify(user));
        else localStorage.removeItem('current_user');
    },
    logout: () => localStorage.removeItem('current_user')
};