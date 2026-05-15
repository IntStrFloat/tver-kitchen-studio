# Tver Kitchen Studio

Сайт студии кухонь в Твери (Next.js).

## Продакшн-сервер

Учётные данные хранятся в `.claude-secrets` (gitignored). Перед SSH-командами загружай переменные:

```bash
set -a; source .claude-secrets; set +a
```

- Хост: `$SSH_HOST` (`185.154.193.96`)
- Пользователь: `$SSH_USER` (`root`)
- Аутентификация: пока по паролю (см. `.claude-secrets`). **Желательно перейти на SSH-ключи** — см. ниже.

### Информация о сервере

- ОС: **Ubuntu 24.04.4 LTS (Noble Numbat)**, kernel 6.8.0-111-generic, x86_64
- Hostname: `spb-3-vm-k5nx`
- Диск: 38 ГБ (`/dev/sda1`)
- RAM: 1.9 ГБ + **2 ГБ swap** (`/swapfile`, в `/etc/fstab`)
- Установлено: Node.js 20.20.2, npm 10.8.2, nginx 1.24.0, certbot 2.9.0, ufw, git

### Что развёрнуто

| Компонент | Где / как |
|---|---|
| Код | `/var/www/tver-kitchen-studio` (origin = github.com/IntStrFloat/tver-kitchen-studio) |
| Next.js process | systemd-юнит `tver-kitchen-studio.service`, `next start -H 127.0.0.1 -p 3000` |
| Env-файл | `/etc/tver-kitchen-studio.env` (chmod 600, читается systemd через `EnvironmentFile=-`) — сюда класть `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_IDS` |
| nginx | `/etc/nginx/sites-available/kuhnitver.ru` (symlink в `sites-enabled/`), `default` site удалён |
| TLS | Let's Encrypt, `/etc/letsencrypt/live/kuhnitver.ru/`, домены `kuhnitver.ru` + `www.kuhnitver.ru`, ECDSA, истекает 2026-08-13, автообновление через `certbot.timer` |
| Firewall | ufw активен: OpenSSH (22), Nginx Full (80, 443) |
| HTTPS | https://kuhnitver.ru/ → 200, http:// → 301 на https:// |

### Пайплайн обновления кода

```bash
ssh root@185.154.193.96
cd /var/www/tver-kitchen-studio
git pull
npm ci --no-audit --no-fund
NODE_OPTIONS='--max-old-space-size=1536' npm run build
systemctl restart tver-kitchen-studio
journalctl -u tver-kitchen-studio -n 50 --no-pager
```

### Известные TODO

- В `/etc/tver-kitchen-studio.env` пока пусто — форма заявок (`/api/telegram`) вернёт 500, пока не положим `TELEGRAM_BOT_TOKEN=...` и `TELEGRAM_CHAT_IDS=...` и не сделаем `systemctl restart tver-kitchen-studio`.
- Парольный SSH всё ещё включён — рекомендую переход на SSH-ключи (см. ниже).

### Подключение через bash (Windows / Git Bash)

В этом окружении `sshpass` и `plink` **недоступны**. Рабочий метод — **Python + paramiko** (установлен в `pip`). Шаблон скрипта:

```bash
python <<'PY'
import paramiko
creds = {}
with open('.claude-secrets') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1); creds[k] = v

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(creds['SSH_HOST'], username=creds['SSH_USER'],
               password=creds['SSH_PASSWORD'], timeout=15,
               allow_agent=False, look_for_keys=False)

for cmd in ["uname -a", "uptime"]:           # ← сюда команды
    print(f"\n$ {cmd}")
    _, out, err = client.exec_command(cmd, timeout=30)
    print(out.read().decode(errors='replace').rstrip())
    e = err.read().decode(errors='replace').rstrip()
    if e: print("STDERR:", e)
client.close()
PY
```

Для интерактивной сессии (пароль вводит пользователь):
```bash
ssh root@185.154.193.96
```

Для передачи файлов через paramiko используй `client.open_sftp()` (`sftp.put(local, remote)` / `sftp.get(remote, local)`).

### Передача файлов

```bash
# scp с sshpass
sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=accept-new local.txt "$SSH_USER@$SSH_HOST:/root/"

# rsync
sshpass -p "$SSH_PASSWORD" rsync -avz -e "ssh -o StrictHostKeyChecking=accept-new" ./dist/ "$SSH_USER@$SSH_HOST:/var/www/tver-kitchen-studio/"
```

### Рекомендуется: переход на SSH-ключи

Парольная аутентификация менее безопасна и плохо автоматизируется. Однократная настройка:

```bash
# 1. Сгенерировать ключ (если ещё нет)
ssh-keygen -t ed25519 -f ~/.ssh/tver_kitchen_server -N ""

# 2. Скопировать публичный ключ на сервер
sshpass -p "$SSH_PASSWORD" ssh-copy-id -i ~/.ssh/tver_kitchen_server.pub "$SSH_USER@$SSH_HOST"

# 3. После этого подключаться можно так:
ssh -i ~/.ssh/tver_kitchen_server root@185.154.193.96
```

Можно добавить в `~/.ssh/config`:
```
Host tver-kitchen
    HostName 185.154.193.96
    User root
    IdentityFile ~/.ssh/tver_kitchen_server
```
И тогда: `ssh tver-kitchen`.

## Правила для Claude при работе с сервером

- **Подтверждай разрушительные команды** (`rm -rf`, `systemctl stop`, `DROP`, изменение firewall, перезагрузка) — спроси пользователя до выполнения.
- **Не выводи пароль в чат**, не пиши его в commit messages, не передавай в URL.
- **Не коммить** `.claude-secrets` ни при каких условиях — он в `.gitignore`.
- Для долгих процессов на сервере используй `nohup`, `screen` или `tmux` — не оставляй висящие SSH-сессии.
- Перед изменениями конфигов делай бэкап: `cp /etc/nginx/nginx.conf{,.bak-$(date +%F)}`.
- Логи смотри через `journalctl -u <service> -n 100 --no-pager` или `tail -n 200 /var/log/...`.

## Локальная разработка

```bash
npm install
npm run dev      # dev-сервер
npm run build    # production-сборка
npm run start    # запуск production-сборки
```
