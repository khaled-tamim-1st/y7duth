FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Install runtime dependencies
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund --ignore-scripts

# Copy compiled Astro server build and static client assets
COPY dist ./dist
COPY public ./public

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
