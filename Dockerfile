FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY dist ./dist
ENV ORDERFLOW_TRANSPORT=http ORDERFLOW_HOST=0.0.0.0 PORT=3333
EXPOSE 3333
USER node
CMD ["node", "dist/index.js"]
