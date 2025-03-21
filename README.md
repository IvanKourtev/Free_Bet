# FreeBet API

## Конфигурация на проекта

### Изисквания
- .NET 7.0 SDK
- SQL Server (LocalDB или standalone)
- Twilio акаунт (за SMS функционалност)

### Настройка на средата

1. Клонирайте репозиторито
2. Копирайте `appsettings.Example.json` в `appsettings.json`
3. Попълнете следните настройки в `appsettings.json`:
   - ConnectionStrings.DefaultConnection - вашата база данни
   - JwtSettings.SecretKey - генерирайте сигурен ключ
   - TwilioSettings - вашите Twilio credentials

### Сигурност
- Никога не комитвайте `appsettings.json` с реални credentials
- Използвайте User Secrets за локална разработка
- За production среда, използвайте environment variables или secure configuration management

### Разработка
1. Инсталирайте зависимостите:
```bash
dotnet restore
```

2. Приложете миграциите:
```bash
dotnet ef database update
```

3. Стартирайте проекта:
```bash
dotnet run
```

## API Endpoints

### Автентикация
- POST /api/auth/register - Регистрация на нов потребител
- POST /api/auth/login - Вход в системата
- POST /api/auth/verify-phone - Верификация на телефонен номер

### Потребители
- GET /api/users/me - Информация за текущия потребител
- PUT /api/users/me - Актуализация на профила

## Тестване
```bash
dotnet test
``` 