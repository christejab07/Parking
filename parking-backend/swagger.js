const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Parking Management System API',
    version: '1.0.0',
    description: 'API for managing parking bookings and tickets',
  },
  servers: [
    {
      url: 'http://localhost:5000',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'email', 'password'],
                properties: {
                  username: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User registered successfully' },
          '400': { description: 'Bad request' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login user and return JWT token',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful login with JWT token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/vehicles': {
      post: {
        summary: 'Create a new vehicle',
        tags: ['Vehicles'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['plateNumber', 'brand', 'model', 'color'],
                properties: {
                  plateNumber: { type: 'string' },
                  brand: { type: 'string' },
                  model: { type: 'string' },
                  color: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Vehicle created successfully' },
          '400': { description: 'Bad request' },
          '401': { description: 'Authentication required' },
        },
      },
      get: {
        summary: 'Get all vehicles for authenticated user',
        tags: ['Vehicles'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of vehicles',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      plateNumber: { type: 'string' },
                      brand: { type: 'string' },
                      model: { type: 'string' },
                      color: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          '400': { description: 'Bad request' },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/api/vehicles/{id}': {
      put: {
        summary: 'Update a vehicle',
        tags: ['Vehicles'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  plateNumber: { type: 'string' },
                  brand: { type: 'string' },
                  model: { type: 'string' },
                  color: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Vehicle updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    plateNumber: { type: 'string' },
                    brand: { type: 'string' },
                    model: { type: 'string' },
                    color: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': { description: 'Bad request' },
          '401': { description: 'Authentication required' },
          '404': { description: 'Vehicle not found or not owned by user' },
        },
      },
      delete: {
        summary: 'Delete a vehicle',
        tags: ['Vehicles'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Vehicle deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': { description: 'Bad request' },
          '401': { description: 'Authentication required' },
          '404': { description: 'Vehicle not found or not owned by user' },
        },
      },
    },
    '/api/bookings': {
      post: {
        summary: 'Create a new booking',
        tags: ['Bookings'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['vehicleId', 'startTime', 'endTime'],
                properties: {
                  vehicleId: { type: 'integer' },
                  startTime: { type: 'string', format: 'date-time' },
                  endTime: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Booking created successfully' },
          '400': { description: 'Bad request' },
          '401': { description: 'Authentication required' },
          '404': { description: 'Vehicle not found' },
        },
      },
    },
    '/api/bookings/{id}/approve': {
      put: {
        summary: 'Approve a booking (Admin only)',
        tags: ['Bookings'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Booking approved successfully' },
          '403': { description: 'Admin access required' },
          '404': { description: 'Booking not found' },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/api/tickets': {
      get: {
        summary: 'Get all tickets for authenticated user',
        tags: ['Tickets'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of tickets',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      startTime: { type: 'string', format: 'date-time' },
                      endTime: { type: 'string', format: 'date-time' },
                      status: { type: 'string', enum: ['paid', 'unpaid'] },
                    },
                  },
                },
              },
            },
          },
          '400': { description: 'Bad request' },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/api/tickets/{id}/pay': {
      put: {
        summary: 'Pay a ticket',
        tags: ['Tickets'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Ticket paid successfully' },
          '404': { description: 'Ticket not found' },
          '401': { description: 'Authentication required' },
        },
      },
    },
  },
};

module.exports = {
  swaggerUi,
  swaggerDocument,
};