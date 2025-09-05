# CivicReport - Municipal Issue Reporting System

A comprehensive municipal issue reporting system that enables citizens to report civic issues and provides administrators with real-time dashboards for efficient issue management.

## Features

### For Citizens
- **Easy Issue Reporting**: GPS-enabled submissions with photo and voice note support
- **Progress Tracking**: Real-time status updates from submission to resolution
- **Transparent Communication**: Direct messaging with assigned departments
- **Mobile-First Design**: Optimized for mobile devices with responsive layout

### For Administrators
- **Live Dashboard**: Real-time analytics and report management
- **Automated Routing**: Smart assignment based on category and location
- **SLA Tracking**: Service Level Agreement compliance monitoring
- **Bulk Management**: Efficient tools for handling multiple reports

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Notifications**: Sonner for toast messages
- **Build Tool**: Vite
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd civic-report-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Demo Accounts

### Citizen Account
- Email: `citizen@example.com`
- Password: `password123`

### Administrator Account
- Email: `admin@city.gov`
- Password: `admin123`

## Deployment

This app is configured for deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Deploy automatically with zero configuration

The app includes proper configuration files for Vercel deployment.

## Features Demonstrated

- **Multi-factor Authentication**: Secure login for both citizens and administrators
- **Real-time Updates**: Automatic status changes and notifications
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Interactive Maps**: Visual representation of reported issues
- **Progress Tracking**: Visual progress indicators for issue resolution
- **Role-based Access**: Different interfaces for citizens vs administrators

## Future Enhancements

- Integration with Google Maps API for real mapping
- Push notifications via service workers
- Database integration with Supabase
- File upload to cloud storage
- SMS notifications
- Multi-language support
- Dark mode theme
- Offline functionality

## Contributing

This is a prototype application built for demonstration purposes. For production use, consider implementing:

- Real authentication system
- Database persistence
- File storage integration
- API rate limiting
- Security headers
- Error monitoring
- Analytics tracking

## License

This project is for demonstration purposes only.