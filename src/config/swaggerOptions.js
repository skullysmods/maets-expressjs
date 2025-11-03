export default {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Maets API",
      version: "1.0.0",
      description:
        "Documentation Swagger de l'API/Back-end de l'appli Maets (ExpressJS)",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Game: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "1",
            },
            name: {
              type: "string",
              example: "Chess",
            },
          },
        },
        GameConfig: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "664a1b2c3d4e5f6a7b8c9d0e",
            },
            userId: {
              type: "number",
              example: 123,
            },
            gameId: {
              type: "number",
              example: 1,
            },
            resolution: {
              type: "object",
              properties: {
                width: { type: "number", example: 1920 },
                height: { type: "number", example: 1080 },
              },
            },
            graphicsQuality: {
              type: "string",
              enum: ["Low", "Medium", "High", "Ultra"],
              example: "High",
            },
            frameRateLimit: {
              type: "number",
              example: 60,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-05-01T12:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-05-01T12:10:00.000Z",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*js"],
};