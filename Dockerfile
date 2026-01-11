# Базовый образ
FROM node:20-alpine

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate
# Сборка проекта
RUN npm run build

# По умолчанию запускаем команду из docker-compose.yml
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
