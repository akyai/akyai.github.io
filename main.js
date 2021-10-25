const request = new Request('https://akyai.github.io',{method: 'POST', body: '{"foo": "bar"}'});

const URL = request.url;
const method = request.method;
const credentials = request.credentials;

fetch(request)
  .then(response => console.log(response))
