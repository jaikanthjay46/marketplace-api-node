### Development stage

FROM node:16-alpine3.14 as development

# Install git
RUN apk add --no-cache git python3

# Install dockerize
ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install node_modules in a separate directory
WORKDIR /home/node

# Copy package.json
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Set path to run packages from node_modules
ENV PATH /home/node/node_modules/.bin:$PATH

# Use /home/node/app as the CWD

# Copy all project files
COPY . .

# Run development server
ENTRYPOINT ["npm", "run", "start:dev"]



### Build stage

FROM development as build

# Transpile TypeScript files to JavaScript
RUN npm build



### Final stage

FROM node:16-alpine3.14 as final

# Install git
RUN apk add --no-cache git python3

# Install dockerize
ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Switch to user node
USER node

# Prepare destination directory and ensure user node owns it
RUN mkdir -p /home/node && chown -R node:node /home/node

# Set CWD
WORKDIR /home/node

# Copy compiled files and change ownership to user node
COPY --chown=node:node --from=build /home/node/.env .
COPY --chown=node:node --from=build /home/node/.sequelizerc .
COPY --chown=node:node --from=build /home/node/db ./db
COPY --chown=node:node --from=build /home/node/dist ./dist
COPY --chown=node:node --from=build /home/node/public ./public
COPY --chown=node:node --from=build /home/node/package*.json ./

# Install production dependencies
RUN npm ci

# Run server
ENTRYPOINT ["node", "./dist/server.js"]
