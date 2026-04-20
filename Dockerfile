FROM nginx:latest

# Copy game files to nginx public directory
COPY . /usr/share/nginx/html/

# Expose port 80 (default HTTP)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
