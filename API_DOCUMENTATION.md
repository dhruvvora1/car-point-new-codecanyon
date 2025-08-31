# CarPoint API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
The API uses Laravel Sanctum for authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer {your-token}
```

## Endpoints

### Authentication

#### POST /login
Login user and get access token.

**Request Body:**
```json
{
    "email": "admin@carpoint.com",
    "password": "admin123"
}
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "name": "CarPoint Admin",
        "email": "admin@carpoint.com",
        "role": "admin",
        "is_approved": true,
        "is_active": true
    },
    "token": "1|abc123...",
    "message": "Login successful"
}
```

#### POST /register
Register a new user account.

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "seller",
    "phone": "+1234567890"
}
```

#### POST /logout
Logout current user (requires authentication).

### Cars

#### GET /cars
Get public car listings (no authentication required).

**Query Parameters:**
- `page` (int): Page number
- `per_page` (int): Items per page (max 50)
- `brand` (string): Filter by brand
- `status` (string): Filter by status (available, sold, pending)
- `price_min` (number): Minimum price
- `price_max` (number): Maximum price
- `city` (string): Filter by city
- `search` (string): Search in brand, model, description

**Response:**
```json
{
    "data": [
        {
            "id": 1,
            "brand": "Toyota",
            "model": "Camry",
            "year": 2022,
            "price": 2500000,
            "currency": "INR",
            "images": ["url1", "url2"],
            "status": "available",
            "is_featured": false,
            "seller": {
                "name": "John Doe",
                "city": "Mumbai"
            }
        }
    ],
    "meta": {
        "current_page": 1,
        "last_page": 5,
        "total": 50
    }
}
```

### Admin Endpoints (requires admin role)

#### GET /admin/dashboard-stats
Get admin dashboard statistics.

**Response:**
```json
{
    "stats": {
        "totalSellers": 25,
        "activeSellers": 20,
        "pendingSellers": 5,
        "totalCars": 150,
        "availableCars": 120,
        "soldCars": 30
    },
    "monthlyData": [
        {
            "month": "Jan 2024",
            "sellers": 5,
            "cars": 25,
            "sales": 8
        }
    ]
}
```

#### GET /admin/sellers
Get all sellers with pagination and filters.

#### PATCH /admin/sellers/{id}/approve
Approve a seller account.

#### PATCH /admin/sellers/{id}/reject
Reject a seller account.

#### PATCH /admin/sellers/{id}/suspend
Suspend a seller account.

#### PATCH /admin/sellers/{id}/reactivate
Reactivate a suspended seller account.

### Seller Endpoints (requires seller role and approval)

#### GET /seller/dashboard-stats
Get seller dashboard statistics.

**Response:**
```json
{
    "stats": {
        "totalCars": 10,
        "availableCars": 8,
        "soldCars": 2,
        "totalViews": 1500,
        "totalInquiries": 25,
        "unreadMessages": 3
    }
}
```

#### POST /seller/cars
Create a new car listing.

**Request Body (multipart/form-data):**
```
brand: Toyota
model: Camry
year: 2022
mileage: 15000
fuel_type: petrol
transmission: automatic
price: 2500000
currency: INR
location: Near City Mall
city: Mumbai
state: Maharashtra
country: India
description: Well maintained car...
features[]: Air Conditioning
features[]: Power Steering
images[]: (file)
images[]: (file)
video_url: https://youtube.com/watch?v=...
```

#### GET /seller/cars
Get seller's car listings.

#### PUT /seller/cars/{id}
Update a car listing.

#### DELETE /seller/cars/{id}
Delete a car listing.

#### PATCH /seller/cars/{id}/mark-sold
Mark a car as sold.

### Chat Endpoints

#### GET /chat/rooms
Get user's chat rooms.

**Response:**
```json
{
    "data": [
        {
            "id": 1,
            "name": "General Sellers Chat",
            "type": "group",
            "participants_count": 15,
            "latest_message": {
                "message": "Hello everyone!",
                "sender": "John Doe",
                "created_at": "2024-01-15T10:30:00Z"
            }
        }
    ]
}
```

#### POST /chat/rooms
Create a new chat room.

#### GET /chat/rooms/{id}/messages
Get messages from a chat room.

**Query Parameters:**
- `page` (int): Page number for pagination
- `per_page` (int): Messages per page (default 20)

#### POST /chat/rooms/{id}/messages
Send a message to a chat room.

**Request Body:**
```json
{
    "message": "Hello!",
    "type": "text"
}
```

For image messages:
```
message: (optional)
type: image
attachment: (file)
```

For car reference messages:
```json
{
    "message": "Check out this car",
    "type": "car_reference",
    "car_id": 123
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
    "message": "Error description",
    "errors": {
        "field": ["Validation error message"]
    }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Rate Limiting

API endpoints are rate limited:
- Authentication endpoints: 5 requests per minute
- General API endpoints: 60 requests per minute
- Chat endpoints: 100 requests per minute

## Real-time Events (Pusher/Laravel Echo)

### Chat Events
- `MessageSent` - New message in chat room
- `UserOnline` - User came online (future enhancement)
- `UserOffline` - User went offline (future enhancement)

### Admin Events
- `SellerApproved` - Seller account approved
- `SellerRejected` - Seller account rejected
- `CarFeatured` - Car marked as featured

### Example Laravel Echo Usage (JavaScript)
```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.VITE_PUSHER_APP_KEY,
    cluster: process.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
    },
});

// Listen for new messages in a chat room
echo.private(`chat-room.${chatRoomId}`)
    .listen('MessageSent', (data) => {
        console.log('New message:', data.message);
    });

// Leave the channel when done
echo.leaveChannel(`chat-room.${chatRoomId}`);
```

### Development Mode
For development, you can use the log driver which will log events instead of broadcasting:
```env
BROADCAST_CONNECTION=log
```

### Production Mode
For production, configure Pusher credentials:
```env
BROADCAST_CONNECTION=pusher
PUSHER_APP_ID=your-app-id
PUSHER_APP_KEY=your-app-key
PUSHER_APP_SECRET=your-app-secret
PUSHER_APP_CLUSTER=mt1
```
