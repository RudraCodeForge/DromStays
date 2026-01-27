const handleServerError = (error) => {
    if (!error.response) {
        window.location.href = "/server-error";
        return true;
    }

    if (error.response.status >= 500) {
        window.location.href = "/server-error";
        return true;
    }

    return false;
};
export default handleServerError;