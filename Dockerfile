FROM node:16.8.0

EXPOSE 8000

COPY . ./

CMD ["node", "./dist/index.js"]