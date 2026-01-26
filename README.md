# Phantom CVS - Сайт спортивного клуба

Веб-сайт для управления спортивным клубом стрелкового спорта.

## Возможности
- Рейтинг спортсменов
- Календарь соревнований
- Форум
- Личные кабинеты

## Быстрый старт

```bash
# 1. Установите Docker Desktop

# 2. Запустите проект
docker-compose up --build

# 3. Откройте http://localhost
```

## Основные команды

```bash
# Запустить
docker-compose up

# Остановить
docker-compose down

# Создать админа
docker-compose exec web python manage.py createsuperuser

# Посмотреть логи
docker-compose logs
```

## Подробная документация

Читайте файл: **КАК РАБОТАТЬ С ДОКЕРОМ.md**

---

**Технологии:** Django, PostgreSQL, Nginx, Docker
