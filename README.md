# Medical Records System

A secure and modern medical records management system built with Next.js, Material-UI, and MongoDB.

## Features

- 🏥 Centralized medical file management
- 🔒 Secure authentication and authorization
- 📱 Responsive design with dark mode support
- 🔄 Real-time updates
- 📊 Comprehensive medical history tracking

## Tech Stack

- **Frontend**: Next.js 13+, Material-UI, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: NextAuth.js
- **State Management**: React Context
- **Styling**: Tailwind CSS + Material-UI

## Prerequisites

- Node.js 16.x or later
- MongoDB 4.x or later
- npm or yarn

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd medical-records-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp src/config/env.example .env.local
   ```
   Edit `.env.local` and add your configuration values.

4. Start MongoDB:
   Make sure your MongoDB instance is running.

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js 13 app directory
│   ├── (roles)/           # Role-based routes
│   │   ├── patient/       # Patient-specific pages
│   │   ├── doctor/        # Doctor-specific pages
│   │   └── admin/         # Admin-specific pages
│   └── api/               # API routes
├── components/            # Reusable components
├── lib/                   # Utilities and helpers
│   ├── api/              # API utilities
│   ├── db/               # Database configuration
│   └── models/           # MongoDB models
├── styles/               # Global styles
└── config/              # Configuration files
```

## API Routes

### Medical File Endpoints

- `GET /api/medical-file` - Get patient's medical file
- `POST /api/medical-file` - Create new medical file
- `PATCH /api/medical-file` - Update medical file

### Section-specific Endpoints

- `GET /api/medical-file/[section]` - Get specific section (conditions, allergies, etc.)
- `POST /api/medical-file/[section]` - Add item to section
- `PATCH /api/medical-file/[section]` - Update item in section
- `DELETE /api/medical-file/[section]` - Remove item from section

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security

This project implements various security measures:

- Authentication using NextAuth.js
- JWT for secure sessions
- CORS protection
- Input validation
- XSS protection
- CSRF protection
- Rate limiting

Please report any security vulnerabilities responsibly.
