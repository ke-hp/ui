# Base node image
FROM node:8.9
MAINTAINER wan <wan@nradiowifi.com>

# Change npm source 
RUN npm config set registry https://registry.npm.taobao.org

# Set up work dir
RUN mkdir /app
WORKDIR /app

# Set ENV variables
ENV PORT=3000
EXPOSE $PORT

# Set up gems
ADD package.json /app/package.json
RUN npm install

ADD client /app/client
RUN cd client && npm install && npm run build && \
	mv dist /app/views

# Finally, add the rest of our app's code
# (this is done at the end so that changes to
# our app's code don't bust Docker's cache)
ADD . /app

# Run code detecting apparatus 
RUN npm run lint

# Start the web app
ENTRYPOINT ["node"]
CMD ["bin/www.js"]
