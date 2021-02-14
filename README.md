Модуль для работы с rkeeper

## Доступные команды

### `npm install`

Установка зависимостей

### `npm run start ip:port ipKassa:portKassa discountId`

Запуск модуля на указанном `ip`:`port`. <br />
Модуль будет делать запросы на кассовый сервер по адресу `ipKassa`:`portKassa` для проверки статуса заказа. <br />
`discountId` - код скидки (константа)

## Файл окружения (env)

```
TOKEN = <JWT token>
```