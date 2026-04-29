//helper functions to be DRY
const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  //document.getElementById('domoMessage').classList.remove('hidden');
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
  //document.getElementById('domoMessage').classList.add('hidden');

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

const hideError = () => {
    document.getElementById('domoMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    sendRequest,
    //hideError,
};