# bank_bilimzone_v2

Отдельный Fake Bank проект для BilimZone.

Это не просто страница оплаты, а отдельная имитация банка:

- создаётся клиент банка;
- клиенту открывается счёт в сомах KGS;
- создаётся fake bank card;
- банк хранит баланс счёта;
- поддерживаются пополнение, снятие, переводы, оплата;
- есть API для пополнения баланса пользователя BilimZone;
- есть история транзакций;
- frontend и backend находятся в одном отдельном проекте.

## Структура

```text
bank_bilimzone_v2/
  backend/
    config/
    bank/
    manage.py
    requirements.txt
  frontend/
    src/
    package.json
```

## Запуск Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 8001
```

Backend:

```text
http://127.0.0.1:8001
```

## Запуск Frontend

Во втором терминале:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5174
```

## Главная идея интеграции с BilimZone

BilimZone отправляет запрос в Fake Bank:

```http
POST http://127.0.0.1:8001/api/bank/bilimzone/top-up/
```

Тело запроса:

```json
{
  "card_number": "9964000000000001",
  "amount": "500",
  "bilimzone_user_id": "user_15",
  "description": "Пополнение кошелька BilimZone"
}
```

Fake Bank списывает деньги с банковского счёта и возвращает успешную транзакцию.
После этого BilimZone у себя увеличивает wallet balance пользователя.
