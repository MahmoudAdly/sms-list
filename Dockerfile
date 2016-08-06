# Run this docker with: sudo docker run -d -p 3000:3000 -v $(pwd):/var/www/app/current 

FROM ubuntu:14.04.4

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set environment variables
ENV appDir /var/www/app/current

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

# Add our package.json and install *before* adding our app files
RUN npm install -g nodemon concurrently
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p ${appDir} && cp -a /tmp/node_modules ${appDir}

# Add app files
WORKDIR ${appDir}
#ADD . ${appDir}

# Restart nginx
# RUN service nginx restart

# Expose the port
EXPOSE 3000

CMD ["npm", "start"]
