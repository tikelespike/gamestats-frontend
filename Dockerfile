# Step 1: Build the frontend
FROM node:20 AS builder

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

# Step 2: Serve with NGINX
FROM nginx:1.25-alpine

# Replace default config with custom one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

