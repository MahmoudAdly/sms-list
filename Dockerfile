# Run this docker with: sudo docker run -d -p 3000:3000 -v $(pwd):/var/www/app/current 
# Before you run this file for the first time, make sure you remove node_modules/ folders in your host machine.

FROM ubuntu:14.04.4

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set environment variables
ENV appDir /var/www/app

# Run updates and install deps
RUN apt-get update

RUN apt-get install -y -q --no-install-recommends \
    apt-transport-https \
    build-essential \
    ca-certificates \
    curl \
    g++ \
    gcc \
    git \
    make \
    nginx \
    sudo \
    wget \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get -y autoclean

# Install NodeJS
RUN wget https://nodejs.org/dist/v4.4.7/node-v4.4.7-linux-x64.tar.xz
RUN tar -C /usr/local --strip-components 1 -xJf node-v4.4.7-linux-x64.tar.xz

RUN npm install -g nodemon concurrently webpack if-env

# Add our package.json one step above the project and install *before* adding our project.
# This is a hacky hack to avoid overriding node_modules folder when mounting the project.
RUN mkdir -p ${appDir}
ADD package.json ${appDir}/package.json
RUN cd ${appDir} && npm install

# Prepare app files folder
RUN mkdir -p ${appDir}/current
WORKDIR ${appDir}/current

# Expose the port
EXPOSE 3000

CMD ["npm", "start"]
