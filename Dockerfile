FROM node:8 AS build
WORKDIR /app
COPY . .
RUN cd common && npm ci && npm run build
RUN cd frontend && npm ci && npm run test:ci && npm run build
RUN cd backend && npm ci && npm run test:ci && npm run build

FROM node:8-alpine
WORKDIR /app
COPY --from=build /app/common/package* ./common/
COPY --from=build /app/common/dist ./common/dist/
COPY --from=build /app/frontend/build ./frontend/
COPY --from=build /app/backend/package* /app/backend/ormconfig.js ./backend/
COPY --from=build /app/backend/dist ./backend/dist/
RUN cd common && npm ci --production
RUN cd backend && npm ci --production


# Need to be in backend directory for relative paths in ormconfig.json to entities to work
WORKDIR /app/backend
CMD ["node", "dist/index.js"]