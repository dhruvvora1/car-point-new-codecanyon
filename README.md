# 🏎️ CarPoint - Car Marketplace Platform

A full-stack car marketplace web application built with Laravel 12 and React.js, featuring real-time chat, role-based access control, and modern UI.

## 🚀 Features

### Admin Panel
- **Dashboard**: Overview of sellers, cars, and platform statistics
- **Seller Management**: Approve/reject seller accounts, suspend/reactivate users
- **Car Listings Management**: View, edit, delete, and feature car listings
- **Reports & Analytics**: Sales reports, car statistics, and performance metrics
- **Chat Moderation**: Monitor and participate in chat conversations

### Seller Panel
- **Dashboard**: Personal statistics, recent cars, and chat activity
- **Car Management**: Add, edit, delete car listings with multiple images
- **Profile Management**: Update business information and documents
- **Real-time Chat**: One-to-one and group chat with other sellers and admin

### Real-time Features
- **WebSocket Chat**: Instant messaging with Socket.IO
- **Live Notifications**: Real-time updates for approvals, messages, and activities
- **Online Status**: See who's online in chat rooms

## 🛠️ Tech Stack

- **Backend**: Laravel 12, MySQL, Laravel Sanctum
- **Frontend**: React.js, TypeScript, Inertia.js
- **UI**: Tailwind CSS, Radix UI Components
- **Real-time**: Laravel WebSockets, Socket.IO
- **File Storage**: Laravel Storage (configurable for S3)

## 📋 Prerequisites

- PHP 8.2 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Composer

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd car-point-new-codecanyon
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database**
   Update your `.env` file with database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=carpoint
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

6. **Run migrations and seeders**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

7. **Create storage link**
   ```bash
   php artisan storage:link
   ```

8. **Install Laravel Sanctum**
   ```bash
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   ```

9. **Install WebSockets (Optional for real-time chat)**
   ```bash
   php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="migrations"
   php artisan migrate
   php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="config"
   ```

## 🚀 Running the Application

1. **Start the Laravel server**
   ```bash
   php artisan serve
   ```

2. **Start the Vite development server**
   ```bash
   npm run dev
   ```

3. **Start WebSocket server (for real-time chat)**
   ```bash
   php artisan websockets:serve
   ```

4. **Start queue worker (for background jobs)**
   ```bash
   php artisan queue:work
   ```

Or use the convenient development command:
```bash
composer run dev
```

## 👤 Default Admin Account

After running the seeders, you can login with:
- **Email**: admin@carpoint.com
- **Password**: admin123

## 📁 Project Structure

```
app/
├── Http/Controllers/
│   ├── Admin/           # Admin panel controllers
│   ├── Seller/          # Seller panel controllers
│   ├── Auth/            # Authentication controllers
│   └── ChatController.php
├── Models/              # Eloquent models
├── Policies/            # Authorization policies
└── Events/              # WebSocket events

resources/js/
├── components/          # Reusable React components
├── pages/              # Inertia.js pages
│   ├── Admin/          # Admin panel pages
│   ├── Seller/         # Seller panel pages
│   ├── Chat/           # Chat interface pages
│   └── auth/           # Authentication pages
├── layouts/            # Page layouts
└── hooks/              # Custom React hooks

database/
├── migrations/         # Database migrations
└── seeders/           # Database seeders
```

## 🔐 User Roles & Permissions

### Admin
- Full access to all platform features
- Manage sellers (approve, suspend, delete)
- Manage car listings (edit, delete, feature)
- View reports and analytics
- Moderate chat conversations

### Seller
- Requires admin approval before listing cars
- Manage own car listings
- Update profile and business information
- Participate in chat conversations
- View personal dashboard and statistics

## 💬 Chat System

The platform includes a real-time chat system with:
- **Private Chat**: One-to-one conversations between users
- **Group Chat**: General discussion room for all sellers
- **Message Types**: Text, images, and car references
- **Real-time Delivery**: Instant message delivery via WebSockets
- **Message History**: Persistent chat history in database

## 📊 Reports & Analytics

Admin users can access:
- Monthly sales reports
- Car listing statistics
- Top performing sellers
- Brand popularity analytics
- Downloadable reports (future enhancement)

## 🔒 Security Features

- JWT-based authentication with Laravel Sanctum
- Role-based access control
- Email verification for sellers
- CSRF protection
- Input validation and sanitization
- File upload security

## 🚀 Deployment

1. **Production environment setup**
   ```bash
   composer install --optimize-autoloader --no-dev
   npm run build
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

2. **Configure production environment**
   - Set `APP_ENV=production`
   - Set `APP_DEBUG=false`
   - Configure proper database credentials
   - Set up file storage (S3 recommended)
   - Configure mail settings for notifications

3. **WebSocket deployment**
   - Use Laravel WebSockets or external service like Pusher
   - Configure SSL for secure WebSocket connections

## 🧪 Testing

Run the test suite:
```bash
php artisan test
```

## 📝 API Documentation

The API endpoints are documented and can be tested using tools like Postman or Insomnia. Key endpoints include:

- `POST /api/v1/login` - User authentication
- `GET /api/v1/cars` - List cars (public)
- `POST /api/v1/seller/cars` - Create car listing (seller)
- `GET /api/v1/admin/dashboard-stats` - Admin dashboard data

## 🔮 Future Enhancements

- Buyer-side interface for car browsing
- Payment gateway integration
- Advanced search and filtering
- Car comparison feature
- Test drive booking system
- Mobile app development
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, contact: support@carpoint.com
