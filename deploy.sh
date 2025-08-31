#!/bin/bash

# CarPoint Deployment Script
echo "🏎️ CarPoint Deployment Script"
echo "=============================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update your .env file with proper database and other configurations"
fi

# Install PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install --optimize-autoloader

# Generate application key if not set
if grep -q "APP_KEY=$" .env; then
    echo "🔑 Generating application key..."
    php artisan key:generate
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Create database if it doesn't exist (MySQL)
echo "🗄️ Setting up database..."
php artisan migrate --force

# Seed the database with admin user
echo "🌱 Seeding database..."
php artisan db:seed --force

# Create storage link
echo "🔗 Creating storage link..."
php artisan storage:link

# Clear and cache configurations
echo "🧹 Clearing and caching configurations..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Build frontend assets
echo "🏗️ Building frontend assets..."
npm run build

# Set proper permissions (Linux/Mac)
if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "win32" ]]; then
    echo "🔒 Setting proper permissions..."
    chmod -R 755 storage
    chmod -R 755 bootstrap/cache
fi

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🎉 CarPoint is ready to use!"
echo ""
echo "Default Admin Credentials:"
echo "Email: admin@carpoint.com"
echo "Password: admin123"
echo ""
echo "🌐 Access your application at: http://localhost:8000"
echo ""
echo "To start the development servers:"
echo "1. php artisan serve"
echo "2. npm run dev"
echo "3. php artisan queue:work (for real-time features)"
echo ""
echo "Or use: composer run dev (runs all servers concurrently)"
