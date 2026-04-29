//helper functions to be DRY
const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
};

const sendRequest = async (url, data, methodType, handler) => {
  const response = await fetch(url, {
    method: methodType,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if(result.redirect) {
    window.location = result.redirect;
  }
  if(result.error) {
    handleError(result.error);
  }
  if(handler){
    handler(result);
  }
};

module.exports = {
    handleError,
    sendRequest,
};