FROM nginx

COPY .devcontainer/nginx-default.conf /etc/nginx/conf.d/default.conf

