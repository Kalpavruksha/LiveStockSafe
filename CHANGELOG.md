# LiveStockSafe - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- AI-powered health anomaly detection
- Offline-first PWA improvements
- Multi-farm management dashboard
- Livestock breeding cycle tracker

---

## [1.0.0] - 2026-02-21

### Added
- 🐄 **Livestock Management** — Full CRUD for cattle, sheep, goats, and poultry
- 📍 **GPS Tracking & Geofencing** — Real-time location with theft alerts
- 🏥 **Health Records** — Vaccination schedules, vet visits, medical history
- 🔔 **Multi-channel Notifications** — Email, SMS, and Push alerts
- 📊 **Analytics Dashboard** — Herd statistics and activity insights
- 🗺️ **Interactive Map** — Leaflet-based livestock location visualization
- 🔐 **Authentication** — JWT-based secure login/register
- 📱 **PWA Support** — Installable progressive web app with offline capability
- 📄 **PDF Reports** — Export livestock records as PDF documents
- 💬 **Real-time Chat** — WebSocket-powered messaging between farm users
- 🐑 **Sheep Module** — Dedicated wool production and breeding tracking
- 🌐 **REST API** — Full-featured Express.js backend with MongoDB

### Security
- Environment variable-based secret management
- JWT token expiry and refresh
- Input validation and sanitization across all endpoints

---

## [0.9.0] - 2026-01-15 (Beta)

### Added
- Initial backend API with Express + MongoDB
- Basic frontend with React
- User authentication flow
- Livestock CRUD operations

### Fixed
- GeoJSON coordinate validation for theft location reports
- MongoDB index for geospatial queries

---

*Made with ❤️ by [Kalpavruksha](https://github.com/Kalpavruksha)*
