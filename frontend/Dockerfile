FROM node:24
WORKDIR /code/frontend

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]