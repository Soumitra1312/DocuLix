# Use an official Python image as the base
FROM python:3.10-slim

# Install Node.js (for Debian-based images)
RUN apt-get update \
    && apt-get install -y curl gnupg2 \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get install -y supervisor \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy backend code
COPY flask_server/ flask_server/
COPY "Sign Up"/ "Sign Up"/
COPY supervisord.conf ./

# Install Python dependencies
RUN pip install --no-cache-dir -r flask_server/requirements.txt

# Install Node.js dependencies
WORKDIR /app/Sign Up
RUN npm install --omit=dev

# Go back to root workdir
WORKDIR /app

# Expose ports (Flask: 5000, Node: 8080)
EXPOSE 5000 8080

# Start both servers using supervisord
CMD ["/usr/bin/supervisord", "-c", "/app/supervisord.conf"]
