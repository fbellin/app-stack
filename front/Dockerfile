FROM node:lts-slim as base
EXPOSE 5000
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node . /app
RUN npm ci && npm cache clean --force

FROM base as dev
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH
ENV HOST=0.0.0.0
RUN npm install --only=development
CMD ["npm", "run", "dev"]
#CMD ["nodemon", "./bin/www", "--inspect=0.0.0.0:9229"]

# FROM base as source
# COPY --chown=node:node . .

# FROM source as test
# ENV NODE_ENV=development
# ENV PATH=/app/node_ùodules/.bin:$PATH
# COPY --from=dev /app/node_modules /app/node_modules
# RUN eslint .
# RUN npm test
# CMD ["npm", "run"; "test"]

# FROM source as prod
# CMD ["node", "./bin/www"]