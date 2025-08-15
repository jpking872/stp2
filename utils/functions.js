export function setCookie(name, token, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // 30 days from now
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + token + ";" + expires + ";path=/";
}

export function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === " ") cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(nameEQ) === 0)
            return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
}

export function deleteCookie(cookieName) {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}