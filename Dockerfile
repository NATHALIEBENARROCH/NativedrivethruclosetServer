FROM node:12-alpine
WORKDIR /app
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
