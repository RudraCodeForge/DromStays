const handleServerError = (error) => {
  const from = window.location.pathname + window.location.search;
  const encodedFrom = encodeURIComponent(from);

  if (!error.response) {
    window.location.href = `/server-error?from=${encodedFrom}`;
    return true;
  }

  if (error.response.status >= 500) {
    window.location.href = `/server-error?from=${encodedFrom}`;
    return true;
  }

  return false;
};
export default handleServerError;
