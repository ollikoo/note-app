FROM node:16
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
ENV REACT_APP_API_URL=http://localhost:4001
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "serve"]
