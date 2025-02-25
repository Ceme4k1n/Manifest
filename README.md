# Roadmap проекта MANIFEST

### Статусы работы:

    ✅ — Фича реализована
    🚧 — Фича в разработке
    ❌ — Фича запланирована

## Основные возможности

### Регистрация, авторизация, восстановление

- [✅] **Регистрация и авторизация**  
  Реализована базовая регистрация (email, пароль, никнейм) и авторизация с использованием JWT.
- [✅] **Восстановление пароля**  
  В процессе разработки механизма сброса пароля через email или через seed-фразу.
- [❌] **Подтверждение email**  
  Функционал отправки и подтверждения кода для активации аккаунта запланирован.

### Профиль пользователя

- [❌] **Редактирование профиля**  
  Возможность изменить аватар, биографию и прочие данные.
- [❌] **Просмотр публичного профиля**  
  Отображение профиля для других пользователей.

### Работа с контентом

- [❌] **Создание и редактирование постов**  
  Базовый функционал создания постов
- [❌] **Лайки и комментарии**  
  Функционал для взаимодействия с постами (лайки, комментарии) запланирован.
- [❌] **Медиа-вложения**  
  Поддержка загрузки изображений и видео – в будущем.

### Социальные функции

- [❌] **Подписки и лента**  
  Возможность подписываться на других пользователей и формирование ленты постов.
- [❌] **Чаты и личные сообщения**  
  Реализация мессенджера для обмена сообщениями.

### Инфраструктура и оптимизация

- [❌] **Кеширование с Redis**  
  Интеграция Redis для кеширования популярных запросов и данных.
- [❌] **WebSockets и уведомления**  
  Планируется внедрить уведомления в реальном времени с использованием Socket.io + Redis Pub/Sub.

## Будущие фичи

- [❌] **Глубокая кастомизация интерфейса**  
  Возможность менять цветовые схемы, перестраивать расположение блоков, создавать собственные шаблоны ленты и добавлять виджеты из внешних сервисов.
- [❌] **Геймификация социальных взаимодействий**  
  Система достижений, челленджей и рейтингов для мотивации пользователей вести здоровую коммуникацию, создавать качественный контент и участвовать в жизни сообщества. Например, бонусы за помощь в модерации или участие в образовательных инициативах.
- [❌] **Интегрированная экономика и микротранзакции**  
  Встроенная система цифровых валют или токенов для поощрения авторов, совершения микротранзакций между пользователями, оплаты премиум-функций и участия в краудфандинговых инициативах внутри соцсети.
- [❌] **Возможность создавать свои ноды, которые будут монетизироваться**  
  Пользователи смогут ставить свои ноды, тем самым разгружая основную систему и за это будет получать токены на своем блокчейне или на каком нибудь другом.
- [❌] **Создание своего стрим. сервиса и высокая интеграция в соц сеть**
  Аналог Twitch в лучшее его время, жесткая интеграция его в сеть, со всеми вытекающими
- [❌] **DAO-группы**
  Такая система групп позволит владельцам прозрачно и безопасно управлять ими, один человек не сможет сделать что то, что не понравится остальным(удалить группу и тд). Возожность вовлечения самого сообщества в жизнь группы.
- [❌] **Токенезация достижений**
  Пользователи смогу превращать свои достижения в NFT и выставлять у себя в профиле.
- [❌] **Обучение языковой модели на данных из постов пользователей**
  Конечно очень влажные мечты, но рабочие
