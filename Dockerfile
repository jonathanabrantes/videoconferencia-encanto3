# Servir o app estático (HTML/JS/CSS) na porta 80
FROM nginx:alpine

# Remover configuração default do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar arquivos estáticos do app
COPY index.html script.js style.css /usr/share/nginx/html/

# Porta 80 já é exposta pela imagem nginx:alpine
EXPOSE 80

# nginx inicia como processo principal (CMD da imagem base)
# Não é necessário redefinir CMD
