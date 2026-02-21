# LivestockSafe - Digital Identity & Anti-Theft System 🐑🛡️

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.0.0-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-7.0-green.svg)
![PWA](https://img.shields.io/badge/PWA-enabled-purple.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)
![Security Policy](https://img.shields.io/badge/security-policy-red.svg)

**A comprehensive, production-ready livestock management platform with advanced theft prevention, real-time notifications, and offline-first PWA capabilities.**

[Features](#-new-features-implemented) • [Installation](#-getting-started) • [Documentation](#-project-structure) • [Demo](#-demo-script) • [License](#-license)

</div>

---

## 🚀 New Features Implemented

### 1. 📧 Email Notifications
- **Automated theft alerts** sent to owner's email when an animal is reported stolen
- Professional HTML email templates with incident details
- Includes QR code and next steps for filing FIR
- Service: `server/services/emailService.js`

**Configuration**: Add Gmail credentials to `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 2. 📱 Push Notifications (Firebase Ready)
- Push notification infrastructure for real-time theft alerts
- Mock implementation included for demo (production-ready with Firebase setup)
- Service: `server/services/pushService.js`

**To Enable**: Add Firebase service account JSON and uncomment production code in `pushService.js`

### 3. 🗺️ Geolocation Capture
- Automatic GPS coordinates capture when reporting theft
- Timestamp and location stored with theft reports
- Helps authorities track last known location
- Uses browser's Geolocation API

### 4. 📄 Downloadable FIR Report (PDF)
- Professional, police-ready theft report generation
- Includes QR code, owner details, and legal notices
- One-click download from stolen animal's detail page
- Service: `server/services/pdfService.js`

**Endpoint**: `GET /api/sheep/:id/theft-report`

### 5. 🔍 Public Stolen Registry
- Searchable public database of all stolen livestock
- Filter by Tag ID, Name, or Owner
- Contact owner directly or verify animal status
- Route: `/stolen`

**Endpoint**: `GET /api/sheep/public/stolen`

### 6. 📲 PWA (Progressive Web App)
- **Installable** on mobile devices and desktop
- **Offline caching** for core functionality
- Service worker for background sync
- App manifest with custom icons
- Files: `public/manifest.json`, `public/service-worker.js`

### 7. 🔔 Enhanced Theft Protocol
- Multi-channel alert system (Email + Push + Database)
- Geolocation capture at time of report
- Automatic broadcast to all verification nodes
- PDF report generation for legal proceedings

## 📁 Project Structure

```
livestock/
├── client/                          # React + Vite Frontend
│   ├── public/
│   │   ├── manifest.json           # PWA manifest
│   │   ├── service-worker.js       # Offline caching & push
│   │   └── icon-192x192.png        # App icon
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx       # Herd overview
│   │   │   ├── RegisterSheep.tsx   # Animal enrollment
│   │   │   ├── SheepDetails.tsx    # Digital passport + theft reporting
│   │   │   ├── VerifySheep.tsx     # Public QR verification
│   │   │   ├── StolenList.tsx      # 🆕 Public stolen registry
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── components/
│   │   │   └── Navbar.tsx          # Navigation with stolen link
│   │   ├── context/
│   │   │   └── AuthContext.tsx     # Auth state management
│   │   └── api/
│   │       └── index.ts            # Axios instance
│   └── index.html                  # 🆕 PWA meta tags
│
└── server/                          # Node.js + Express Backend
    ├── models/
    │   ├── User.js                 # 🆕 Enhanced with email & FCM token
    │   └── Sheep.js                # 🆕 Geolocation support
    ├── routes/
    │   ├── auth.js                 # Login/Register
    │   └── sheep.js                # 🆕 Enhanced with PDF & stolen list
    ├── services/                   # 🆕 New service layer
    │   ├── emailService.js         # 📧 Email notifications
    │   ├── pushService.js          # 📱 Push notifications
    │   └── pdfService.js           # 📄 PDF generation
    └── index.js                    # Express server
```

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS v4** (Styling)
- **Framer Motion** (Animations)
- **React Router** (Navigation)
- **Axios** (HTTP client)
- **QRCode.react** (QR generation)
- **React Hot Toast** (Notifications)

### Backend
- **Node.js** + **Express**
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **JWT** (Authentication)
- **Nodemailer** (Email service)
- **PDFKit** (PDF generation)
- **Firebase Admin** (Push notifications - optional)

## 🚦 Getting Started

### Prerequisites
```bash
node >= 18.x
npm >= 9.x
MongoDB (local or Atlas)
```

### Installation

1. **Clone & Install Dependencies**
```bash
cd livestock

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

2. **Configure Environment Variables**

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/livestock
JWT_SECRET=your-super-secret-jwt-key
APP_URL=http://localhost:5176
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

3. **Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd server
node index.js
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

4. **Access Application**
- Frontend: `http://localhost:5173` or `http://localhost:5176`
- Backend API: `http://localhost:5000`

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Visit the app in browser
2. Click the install icon in address bar
3. Click "Install"

### Mobile (Android/iOS)
1. Open in Chrome/Safari
2. Tap menu → "Add to Home Screen"
3. App will install with custom icon

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Livestock Management
- `GET /api/sheep` - Get user's herd (protected)
- `POST /api/sheep` - Register new animal (protected)
- `GET /api/sheep/:id` - Get single animal (protected)
- `PATCH /api/sheep/:id/status` - Update status/report theft (protected)

### Public Endpoints
- `GET /api/sheep/verify/:tagId` - Verify animal by QR scan
- `GET /api/sheep/public/stolen` - Get all stolen animals
- `GET /api/sheep/:id/theft-report` - Download FIR PDF (protected)

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App Passwords
3. Add to `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=generated-app-password
```

## 🔔 Push Notifications Setup (Optional)

1. Create Firebase project at https://console.firebase.google.com
2. Download service account JSON
3. Place in `server/firebase-service-account.json`
4. Uncomment production code in `server/services/pushService.js`

## 🎯 Key Features

### For Herders
✅ Digital identity cards for each animal  
✅ QR code generation for verification  
✅ One-click theft reporting with GPS  
✅ Email & push notifications  
✅ Downloadable FIR reports  
✅ Offline-capable PWA  

### For Buyers
✅ Instant QR verification  
✅ Stolen animal alerts  
✅ Owner contact information  
✅ Public stolen registry search  

### For Authorities
✅ Professional FIR reports with QR codes  
✅ Geolocation data for investigations  
✅ Tamper-proof digital records  
✅ Public stolen database  

## 🎨 Design Philosophy

- **Premium Light Theme** - Professional, trustworthy aesthetic
- **Glassmorphism** - Modern, elegant UI components
- **Micro-animations** - Smooth, engaging interactions
- **Mobile-first** - Responsive across all devices
- **Accessibility** - High contrast, clear typography

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS configuration
- Unique tag ID enforcement
- Owner verification for sensitive operations

## 📊 Database Schema

### User Model
```javascript
{
  fullName: String,
  phone: String (unique),
  aadhaar: String (unique),
  password: String (hashed),
  email: String,
  fcmToken: String,
  role: 'herder' | 'admin'
}
```

### Sheep Model
```javascript
{
  owner: ObjectId (ref: User),
  name: String,
  tagId: String (unique),
  breed: String,
  age: Number,
  identifyingMarks: String,
  status: 'active' | 'stolen' | 'sold' | 'deceased',
  theftReportedAt: Date,
  theftDetails: String,
  theftLocation: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  lastSeenLocation: String
}
```

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
cd server
# Set environment variables in platform
# Deploy with Node.js buildpack
```

### Database (MongoDB Atlas)
- Create cluster at https://cloud.mongodb.com
- Update `MONGODB_URI` in `.env`

## 🐛 Troubleshooting

**Service Worker not registering?**
- Ensure HTTPS in production
- Check browser console for errors
- Clear cache and reload

**Email not sending?**
- Verify Gmail app password
- Check spam folder
- Enable "Less secure app access" if needed

**PDF not downloading?**
- Check server logs for errors
- Ensure `pdfkit` is installed
- Verify file permissions

## 📝 License

MIT License - Feel free to use for hackathons, demos, or production!

## 🙏 Acknowledgments

Built with ❤️ for livestock herders and rural communities.

---

**Version**: 2.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready ✅
