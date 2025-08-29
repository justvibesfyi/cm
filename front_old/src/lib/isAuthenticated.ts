import Cookies from 'js-cookie'

function isAuthenticated() {
    return !!Cookies.get('session');
}

export default isAuthenticated;