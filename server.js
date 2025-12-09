'use strict';

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const HapiJwt = require('hapi-auth-jwt2');

async function validate(decoded, request, h) {
  if (!decoded) {
    return { isValid: false, credentials: null };
  }

  const credentials = {
    ...decoded,
    scope: decoded.roles || []
  };

  return {
    isValid: true,
    credentials
  };
}

async function start() {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  await server.register(HapiJwt);

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    verifyOptions: { algorithms: ['HS256'] },
    urlKey: false,
    cookieKey: false,
    validate
  });

  server.route({
    method: 'GET',
    path: '/',
    options: {
      auth: {
        strategy: 'jwt',
        mode: 'optional'
      }
    },
    handler: (request, h) => {
      return {
        message: 'Hello from GET /',
        authed: request.auth.isAuthenticated,
        user: request.auth.credentials || null
      };
    }
  });

  server.route({
    method: 'POST',
    path: '/admin/item',
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin']
      }
    },
    handler: (request, h) => {
      return {
        message: 'admin route hit',
        user: request.auth.credentials
      };
    }
  });

  server.route({
    method: 'PUT',
    path: '/admin/other',
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin']
      }
    },
    handler: (request, h) => {
      return {
        ok: true,
        user: request.auth.credentials
      };
    }
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
}

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

start();
