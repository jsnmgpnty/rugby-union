FROM node:latest

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json /app

# If you are building your code for production
RUN npm set progress=false
RUN npm install

# Bundle app source
COPY . /app

EXPOSE 3000

CMD [ "npm", "run", "stack" ]
