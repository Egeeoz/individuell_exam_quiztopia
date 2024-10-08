const jwt = require('jsonwebtoken');

const validateToken = {
  before: async (request) => {
    try {
      const token = request.event.headers.authorization.replace('Bearer ', '');

      if (!token) throw new Error('No token provided');

      const data = jwt.verify(token, 'a1b1c1');

      request.event.id = data.id;
      request.event.username = data.username;

      return request.response;
    } catch (error) {
      console.error('Token validation failed:', error);
      request.event.error = 'Unauthorized';
      return request.response;
    }
  },
  onError: async (request) => {
    request.event.error = '401';
    return request.response;
  },
};

module.exports = { validateToken };
