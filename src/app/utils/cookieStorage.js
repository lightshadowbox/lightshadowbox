import Cookies from 'js-cookie';

export const createCookie = (name, value, days = 1) => {
    return Cookies.set(name, value, { expires: days });
};

export const readCookie = (name) => {
    return Cookies.get(name);
};

export const eraseCookie = (name) => {
    return Cookies.remove(name);
};
