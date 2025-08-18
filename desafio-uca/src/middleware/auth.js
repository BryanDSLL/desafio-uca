export function checkAuth() {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('userToken');
        const userData = localStorage.getItem('userData');
        
        if (!token || !userData) {
            return null;
        }
        
        try {
            return JSON.parse(userData);
        } catch (error) {
            console.error('Erro ao parsear dados do usuário:', error);
            return null;
        }
    }
    return null;
}

export function logout() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        window.location.href = '/';
    }
}

export function redirectToLogin() {
    if (typeof window !== 'undefined') {
        window.location.href = '/';
    }
}