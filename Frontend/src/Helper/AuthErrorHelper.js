const handleAuthError = (error) => {
    const status = error.response?.status;

    if (status === 401) {
        window.location.href = "/login";
        return true;
    }

    if (status === 403) {
        window.location.href = "/unauthorized";
        return true;
    }

    if (status === 404) {
        window.location.href = "/not-found";
        return true;
    }
    return false;
};

export default handleAuthError;
