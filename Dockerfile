FROM node:8
WORKDIR /app
COPY . .
RUN cd common && npm ci && npm run build
RUN cd frontend && npm ci && npm run test:ci && npm run build
RUN cd backend && npm ci && npm run test:ci && npm run build

# Need to be in backend directory for relative paths in ormconfig.json to entities to work
WORKDIR /app/backend
CMD ["node", "dist/index.js"]