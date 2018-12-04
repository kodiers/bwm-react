import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';


class AuthService {
    getToken() {
        return localStorage.getItem('auth_token');
    }

    decode(token) {
        return jwt.decode(token);
    }

    getExpiration(token) {
        const exp = this.decode(token).exp;
        return moment.unix(exp);
    }

    isValid(token) {
        return moment().isBefore(this.getExpiration(token));
    }

    isAuthenticated() {
        const token = this.getToken();
        if (token && this.isValid(token)) {
            return true;
        }
        return false;
    }
}

export default new AuthService();
