# Project Structure

```
.
├── .next/                      # Next.js build output
├── .git/                       # Git repository
├── node_modules/               # Node.js dependencies
├── public/                     # Static files
├── src/                        # Source code
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── login/         # Login page
│   │   │   ├── logout/        # Logout page
│   │   │   └── register/      # Registration page
│   │   ├── (roles)/           # Role-based routes
│   │   │   ├── admin/         # Admin dashboard and pages
│   │   │   ├── doctor/        # Doctor dashboard and pages
│   │   │   ├── patient/       # Patient dashboard and pages
│   │   │   ├── pharmacist/    # Pharmacist dashboard and pages
│   │   │   └── layout.jsx     # Shared layout for role-based routes
│   │   ├── layout.jsx         # Root layout
│   │   └── page.jsx           # Home page
│   ├── components/            # Reusable React components
│   │   ├── admin/            # Admin-specific components
│   │   ├── auth/             # Authentication components
│   │   ├── common/           # Shared components
│   │   ├── doctor/           # Doctor-specific components
│   │   ├── layout/           # Layout components
│   │   ├── patient/          # Patient-specific components
│   │   ├── pharmacist/       # Pharmacist-specific components
│   │   ├── ui/               # UI components
│   │   ├── AboutSection.jsx  # About section component
│   │   ├── ErrorBoundary.jsx # Error boundary component
│   │   ├── FeaturesSection.jsx # Features section component
│   │   ├── Footer.jsx        # Footer component
│   │   ├── GenericRoleLayout.jsx # Generic role layout
│   │   ├── HeroSection.jsx   # Hero section component
│   │   ├── Navbar.jsx        # Navigation component
│   │   ├── RolesSection.jsx  # Roles section component
│   │   ├── TestimonialsSection.jsx # Testimonials section
│   │   └── ThemeProviderWrapper.jsx # Theme provider
│   ├── config/               # Configuration files
│   ├── hooks/                # Custom React hooks
│   ├── store/                # Redux store and slices
│   │   ├── api/             # API related files
│   │   ├── services/        # API services
│   │   ├── slices/          # Redux slices
│   │   ├── dateSlice.js     # Date state management
│   │   ├── hooks.js         # Redux hooks
│   │   ├── index.js         # Store index
│   │   ├── patientSlice.js  # Patient state management
│   │   ├── provider.jsx     # Redux provider
│   │   └── store.js         # Store configuration
│   ├── styles/              # Global styles
│   └── utils/               # Utility functions
├── package.json             # Project dependencies and scripts
├── package-lock.json        # Locked dependencies
├── config.env               # Environment configuration
├── tailwind.config.cjs      # Tailwind CSS configuration
├── next.config.mjs          # Next.js configuration
├── postcss.config.cjs       # PostCSS configuration
├── jsconfig.json            # JavaScript configuration
├── README.md                # Project documentation
├── vercel.json              # Vercel deployment configuration
├── eslint.config.mjs        # ESLint configuration
└── .gitignore               # Git ignore rules
```

## Directory Descriptions

### Frontend (`src/`)
- **app/**: Next.js 13+ app directory containing all routes and pages
  - **(auth)/**: Authentication-related routes (login, register, logout)
  - **(roles)/**: Role-specific routes and dashboards
- **components/**: Reusable React components
  - **admin/**: Admin-specific components
  - **auth/**: Authentication-related components
  - **common/**: Shared components
  - **doctor/**: Doctor-specific components
  - **layout/**: Layout components
  - **patient/**: Patient-specific components
  - **pharmacist/**: Pharmacist-specific components
  - **ui/**: Reusable UI components
- **config/**: Application configuration files
- **hooks/**: Custom React hooks for shared logic
- **store/**: Redux store configuration and slices
  - **api/**: API-related files
  - **services/**: API services
  - **slices/**: Redux state slices
- **styles/**: Global styles and theme configuration
- **utils/**: Utility functions and helpers

### Configuration Files
- **package.json**: Project dependencies and npm scripts
- **next.config.mjs**: Next.js configuration
- **tailwind.config.cjs**: Tailwind CSS configuration
- **postcss.config.cjs**: PostCSS configuration
- **eslint.config.mjs**: ESLint configuration
- **jsconfig.json**: JavaScript/TypeScript configuration
- **vercel.json**: Vercel deployment settings

### Environment
- **config.env**: Environment variables and configuration
- **.gitignore**: Git ignore rules 