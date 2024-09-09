FROM amd64/nginx

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/letsencrypt/live

CMD ["nginx", "-g", "daemon off;"]