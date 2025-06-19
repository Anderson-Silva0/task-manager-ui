function getApiUrl(service: 'user' | 'task') {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    if (service === 'user') return 'http://localhost:8081';
    if (service === 'task') return 'http://localhost:8082';
  }
  if (service === 'user') return 'http://user-service:8080';
  if (service === 'task') return 'http://task-service:8080';
  throw new Error('Serviço desconhecido: ' + service);
}

export const environment = {
  production: false,
  taskServiceUrl: getApiUrl('task'),
  userServiceUrl: getApiUrl('user')
}; 