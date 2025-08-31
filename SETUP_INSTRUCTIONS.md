# 🏎️ CarPoint Setup Instructions

## Quick Setup (Recommended)

1. **Ensure you have PHP 8.2+ installed**
   ```bash
   php --version
   ```

2. **Run the automated setup**
   ```bash
   composer run setup
   ```

3. **Configure your environment**
   - Update `.env` file with your database credentials
   - Set `APP_URL` to your domain
   - Configure mail settings for notifications

4. **Start development servers**
   ```bash
   composer run dev
   ```

## Manual Setup

### 1. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

Update your `.env` file:
```env
APP_NAME=CarPoint
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=carpoint
DB_USERNAME=root
DB_PASSWORD=your_password

BROADCAST_CONNECTION=pusher
PUSHER_APP_ID=carpoint
PUSHER_APP_KEY=carpoint-key
PUSHER_APP_SECRET=carpoint-secret
PUSHER_HOST=127.0.0.1
PUSHER_PORT=6001
PUSHER_SCHEME=http

MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@carpoint.com
MAIL_FROM_NAME="CarPoint"
```

### 3. Database Setup

```bash
# Create database (MySQL)
mysql -u root -p
CREATE DATABASE carpoint;
exit

# Run migrations
php artisan migrate

# Seed database with admin user
php artisan db:seed
```

### 4. Storage Setup

```bash
# Create storage link for file uploads
php artisan storage:link
```

### 5. Build Frontend

```bash
# Development build
npm run dev

# Production build
npm run build
```

## Running the Application

### Development Mode

Start all services with one command:
```bash
composer run dev
```

This will start:
- Laravel development server (http://localhost:8000)
- Vite development server (for hot reloading)
- WebSocket server (for real-time chat)
- Queue worker (for background jobs)

### Manual Start

If you prefer to start services manually:

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Frontend development
npm run dev

# Terminal 3: WebSocket server
php artisan websockets:serve

# Terminal 4: Queue worker
php artisan queue:work
```

## Default Accounts

### Admin Account
- **Email**: admin@carpoint.com
- **Password**: admin123
- **Access**: Full admin panel access

### Test Seller Account
You can register a new seller account through the registration form. Seller accounts require admin approval before they can list cars.

## Key URLs

- **Main Application**: http://localhost:8000
- **Admin Dashboard**: http://localhost:8000/admin/dashboard
- **Seller Dashboard**: http://localhost:8000/seller/dashboard
- **WebSocket Dashboard**: http://localhost:8000/laravel-websockets (admin only)

## Troubleshooting

### Common Issues

1. **PHP Version Error**
   - Ensure PHP 8.2+ is installed
   - Update your PATH to use the correct PHP version

2. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `.env`
   - Ensure database exists

3. **Permission Errors**
   ```bash
   # Linux/Mac
   chmod -R 755 storage
   chmod -R 755 bootstrap/cache
   
   # Windows (run as administrator)
   icacls storage /grant Everyone:F /T
   icacls bootstrap\cache /grant Everyone:F /T
   ```

4. **WebSocket Connection Issues**
   - Ensure port 6001 is not blocked by firewall
   - Check WebSocket server is running
   - Verify Pusher configuration in `.env`

5. **File Upload Issues**
   - Ensure storage link is created: `php artisan storage:link`
   - Check file permissions on storage directory
   - Verify `FILESYSTEM_DISK=public` in `.env`

### Clearing Cache

If you encounter issues, try clearing all caches:
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
composer dump-autoload
```

## Production Deployment

### 1. Server Requirements
- PHP 8.2+ with required extensions
- MySQL 8.0+
- Node.js 18+
- Web server (Apache/Nginx)
- SSL certificate (recommended)

### 2. Deployment Steps

```bash
# Clone repository
git clone <your-repo-url>
cd carpoint

# Install dependencies
composer install --optimize-autoloader --no-dev
npm install

# Configure environment
cp .env.example .env
# Update .env with production settings

# Setup application
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link

# Build assets
npm run build

# Cache configurations
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 3. Web Server Configuration

#### Nginx Example
```nginx
server {
    listen 80;
    server_name carpoint.com;
    root /var/www/carpoint/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 4. Process Management

Use a process manager like Supervisor to keep services running:

```ini
[program:carpoint-websockets]
command=php artisan websockets:serve
directory=/var/www/carpoint
autostart=true
autorestart=true
user=www-data

[program:carpoint-queue]
command=php artisan queue:work --sleep=3 --tries=3
directory=/var/www/carpoint
autostart=true
autorestart=true
user=www-data
```

## Security Checklist

- [ ] Update default admin password
- [ ] Configure proper file upload limits
- [ ] Set up SSL certificate
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up backup strategy
- [ ] Configure monitoring and logging

## Support

For technical support or questions:
- Email: support@carpoint.com
- Documentation: See README.md and API_DOCUMENTATION.md
