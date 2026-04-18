# Orbitto — Frontend Auth Challenge

Реализация frontend-части для трёх auth-сценариев: регистрация, авторизация, восстановление пароля.

---

## Как запустить проект

### Требования

- Node.js 20+
- Запущенный backend (см. ниже)

### Backend

Используется форк: **https://github.com/vbncursed/engineer-challenge**

```bash
# В директории бэкенда
make up

# или
docker compose up --build -d
```

API будет доступен на `http://localhost:8080/graphql`.

### Frontend

```bash
npm install
npm run dev
```

Приложение откроется на `http://localhost:3000`.

### Сборка

```bash
npm run build
npm run start
```

---

## Тесты

```bash
npm test          # запустить все тесты
npm run test:watch  # watch-режим
```

Покрытые сценарии (unit/integration, `@testing-library/react`):

| Форма                | Тесты                                                                |
| -------------------- | -------------------------------------------------------------------- |
| `SignInForm`         | рендер полей, валидация email/пустого, успешный сабмит               |
| `SignUpForm`         | рендер полей, валидация email/пароля/совпадения, успешный сабмит     |
| `ForgotPasswordForm` | валидация, успешный сабмит, success-стейт при ошибке сети            |
| `ResetPasswordForm`  | отсутствие токена, валидация, несовпадение паролей, сабмит с токеном |

---

## Архитектура frontend

Проект организован по **Feature-Sliced Design (FSD)**:

```
src/
├── app/              # Next.js App Router: layout, providers
│   └── providers/    # StoreProvider, AuthRehydrationProvider
├── views/            # Страницы (аналог pages/ в FSD, переименован из-за конфликта с Next.js)
│   ├── sign-in/
│   ├── sign-up/
│   ├── forgot-password/
│   ├── reset-password/
│   └── dashboard/
├── features/
│   └── auth/         # Формы с логикой (sign-in, sign-up, forgot-password, reset-password)
├── entities/
│   └── session/      # Redux slice: accessToken, isAuthenticated
└── shared/
    ├── api/          # RTK Query + GraphQL baseQuery с mutex-рефрешем
    ├── config/       # API_URL и прочие константы
    ├── router/       # Объект, содержащий пути (routes)
    ├── store/        # makeStore, типы RootState/AppDispatch
    ├── styles/       # Глобальные SCSS-переменные и миксины
    └── ui/           # Button, Input/FormInput — переиспользуемые компоненты
```

### Ключевые инженерные решения

**Auth-токены**

- `access_token` хранится **в Redux (in-memory)** — не доступен из XSS, не уязвим к CSRF.
- `refresh_token` хранится в **httpOnly cookie** (устанавливается бэкендом) — не читается из JS.
- При перезагрузке страницы `AuthRehydrationProvider` автоматически восстанавливает `access_token` через mutation
  `refreshToken`, используя cookie.

**Параллельные запросы и рефреш токена**

`async-mutex` в `baseQuery` гарантирует, что рефреш токена выполняется **ровно один раз**, даже если несколько запросов
одновременно получили 401. Остальные запросы ждут разблокировки mutex и повторяются уже с новым токеном.

**Защита роутов**

Два слоя:

1. **Next.js Middleware** (edge) — редирект по наличию `refresh_token` cookie. Проверяет только факт существования куки,
   не валидирует подпись токена.
2. **Backend JWT-валидация** — каждый запрос с `Authorization: Bearer <token>` проверяется бэкендом. Middleware
   намеренно не верифицирует JWT: `JWT_SECRET` — серверный секрет бэкенда, фронтенд к нему доступа не имеет.

**GraphQL через RTK Query**

Кастомный `baseQuery` делает POST с `{ query, variables }` на единственный endpoint. Ошибки GraphQL (`errors[]`)
нормализуются в единый формат для обработки через `useApiError`.

**UX-состояния**

Все формы обрабатывают состояния загрузки, ошибок и успеха. Кнопки блокируются во время запроса. Ошибки бэкенда
отображаются под формой. Интерфейс адаптирован под desktop и mobile.

---

## Контракты backend и допущения

Backend: GraphQL API на `localhost:8080/graphql`

| Mutation               | Аргументы              | Ответ                     |
| ---------------------- | ---------------------- | ------------------------- |
| `login`                | `email`, `password`    | `{ accessToken, userId }` |
| `register`             | `email`, `password`    | `{ accessToken, userId }` |
| `refreshToken`         | —                      | `{ accessToken }`         |
| `logout`               | —                      | `Boolean`                 |
| `requestPasswordReset` | `email`                | `Boolean`                 |
| `resetPassword`        | `token`, `newPassword` | `Boolean`                 |

**Допущения:**

- `refresh_token` устанавливается бэкендом как `httpOnly` cookie автоматически при логине/регистрации.
- Ошибка 401 или `extensions.code === 'UNAUTHENTICATED'` в GraphQL-ответе запускают рефреш токена.
- `requestPasswordReset` всегда возвращает успех (даже если email не найден) — защита от перебора email-адресов.
  Frontend показывает success-стейт в любом случае (это также отражено в тестах).

---

## Trade-offs

| Решение                                  | Почему                                                                                                           | Альтернатива                                                                 |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `access_token` в Redux, не в cookie      | Не читается через XSS, не уязвим к CSRF-атакам                                                                   | Cookie с `SameSite=Strict` — работает, но требует больше настроек на бэкенде |
| RTK Query вместо React Query             | Уже использую Redux; единый стор для auth state                                                                  | React Query + Zustand — меньше boilerplate, но два стора                     |
| FSD `views/` вместо `pages/`             | `src/pages/` конфликтует с Pages Router Next.js                                                                  | Можно использовать `screens/` или `routes/`                                  |
| `shared/store` импортирует из `entities` | Redux-стор изначально знает обо всех слайсах; в FSD это формальное нарушение, принятое как осознанный компромисс | Вынести стор в `app`-слой                                                    |
| `--webpack` вместо Turbopack             | SVGR + SCSS не работают в Turbopack 16                                                                           | Дождаться поддержки в Turbopack или заменить SVGR на `next/image`            |
| Middleware только как UX-слой            | Edge Runtime не имеет доступа к JWT-секрету                                                                      | Server Actions / Route Handlers для полноценной server-side защиты           |

---

## Что следующим шагом в production

1. **E2E тесты** — полные сценарии входа, регистрации и выхода с реальным запущенным бэкендом, в автоматическом прогоне
   на CI.
2. **Реальная отправка писем** — сейчас бэкенд принимает запрос на восстановление пароля, но письмо на почту не
   приходит. Нужна интеграция с почтовым сервисом (Resend, SendGrid) на стороне бэкенда.
3. **Ротация refresh-токена** — при каждом обновлении токена бэкенд должен инвалидировать старый. Сейчас если
   refresh-токен утечёт, им можно пользоваться бесконечно.
4. **Автогенерация типов из GraphQL-схемы** — сейчас типы для запросов написаны вручную в `graphql/types.ts`. При
   изменении схемы бэкенда они могут разъехаться; кодогенерация это исключает.
5. **Защита от перебора** — на бэкенде нужен rate limiting для форм входа и восстановления пароля, на фронте —
   блокировка повторной отправки формы на время ожидания ответа.
