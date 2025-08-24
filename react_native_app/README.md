# FDS Bengali PDF Statement System - React Native App

A comprehensive React Native mobile application for the Friends Development Society (FDS) Bengali PDF Statement System, built with modern technologies and best practices.

## 🌟 Features

### 🔐 Authentication System
- **Admin Login**: Secure authentication for administrators
- **Member Portal**: Account number-based access for members
- **Token Management**: JWT token handling with secure storage
- **Session Persistence**: Automatic login with secure token storage

### 👥 Admin Dashboard
- **Member Management**: Add, edit, delete members
- **Contribution Tracking**: Record and manage monthly contributions
- **Statistics & Analytics**: Overview of membership and financial data
- **PDF Generation**: Generate member statements in Bengali
- **Data Export**: Export data in various formats

### 📱 Member Portal
- **Account Access**: Login using 6-digit account number
- **Contribution History**: View personal contribution records
- **Statement Downloads**: Download PDF statements
- **Profile Management**: Update personal information
- **Real-time Status**: View current payment status

### 🎨 User Interface
- **Modern Design**: Clean, intuitive interface with Material Design
- **Responsive Layout**: Works seamlessly on phones and tablets
- **Dark/Light Theme**: Theme support for better user experience
- **Bengali Language**: Native Bengali language support
- **Smooth Animations**: Engaging user interactions

## 🛠️ Technology Stack

### Core Technologies
- **React Native**: Cross-platform mobile development
- **Redux Toolkit**: State management with persistence
- **React Navigation**: Navigation and routing
- **React Native Paper**: Material Design components
- **Axios**: HTTP client for API communication

### Development Tools
- **TypeScript**: Type-safe development
- **ESLint**: Code linting and formatting
- **Jest**: Testing framework
- **Metro Bundler**: JavaScript bundler

### Native Modules
- **React Native Vector Icons**: Icon library
- **React Native Async Storage**: Local storage
- **React Native Encrypted Storage**: Secure token storage
- **React Native PDF Lib**: PDF generation
- **React Native Share**: Social sharing
- **React Native FS**: File system access

## 📱 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- React Native CLI
- Android Studio / Xcode (for native development)

### Clone the Repository
```bash
git clone <repository-url>
cd react_native_app
```

### Install Dependencies
```bash
npm install
# or
yarn install
```

### iOS Setup
```bash
cd ios
pod install
cd ..
```

### Android Setup
```bash
# Make sure you have Android Studio installed and configured
# No additional setup required for basic functionality
```

### Run the Application
```bash
# For Android
npm run android

# For iOS
npm run ios

# Start Metro bundler
npm start
```

## 🔧 Configuration

### API Configuration
Update the API base URL in `src/services/apiService.js`:

```javascript
constructor() {
  this.baseURL = 'http://localhost:3000/api'; // Update this
  // ... rest of the configuration
}
```

### Environment Variables
Create a `.env` file in the root directory:

```env
API_URL=http://localhost:3000/api
TIMEOUT=30000
RETRY_ATTEMPTS=3
```

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
├── models/             # Data models (Admin, Member, Contribution)
├── navigation/         # Navigation configuration
├── screens/            # App screens
│   ├── auth/          # Authentication screens
│   ├── admin/         # Admin dashboard screens
│   └── member/        # Member portal screens
├── services/          # API services
├── store/             # Redux store configuration
│   └── slices/        # Redux slices
└── utils/             # Utility functions
```

## 🚀 Key Features Implementation

### Authentication Flow
1. **Login Screen**: Users enter credentials (admin) or account number (members)
2. **Token Storage**: JWT tokens stored securely using encrypted storage
3. **Route Protection**: Protected routes based on user roles
4. **Auto-refresh**: Automatic token refresh and session management

### Member Management
1. **CRUD Operations**: Full member lifecycle management
2. **Validation**: Input validation and error handling
3. **Search & Filter**: Advanced member search capabilities
4. **Account Generation**: Automatic 6-digit account number generation

### Contribution Tracking
1. **Monthly Records**: Track contributions by month and year
2. **Payment Methods**: Support for multiple payment methods
3. **Statistics**: Real-time contribution analytics
4. **Reports**: Generate contribution reports

### PDF Generation
1. **Bengali PDF**: Generate PDF statements in Bengali language
2. **Custom Templates**: Professional statement templates
3. **Download & Share**: Easy statement distribution
4. **Batch Processing**: Generate multiple statements

## 🔐 Security Features

### Data Protection
- **Encrypted Storage**: Sensitive data stored encrypted
- **Secure Communication**: HTTPS API communication
- **Token Management**: Secure JWT token handling
- **Session Timeout**: Automatic session expiration

### Input Validation
- **Form Validation**: Client-side validation for all inputs
- **Sanitization**: Input sanitization to prevent XSS
- **API Validation**: Server-side validation as backup
- **Error Handling**: Comprehensive error handling

## 🎨 UI/UX Features

### Design System
- **Consistent Theme**: Unified design language
- **Color Palette**: Professional color scheme
- **Typography**: Readable fonts with proper hierarchy
- **Spacing**: Consistent spacing system

### User Experience
- **Loading States**: Loading indicators for async operations
- **Error Messages**: User-friendly error handling
- **Empty States**: Helpful empty state designs
- **Offline Support**: Basic offline functionality

## 📱 Platform Support

### Android
- **Minimum Version**: Android 5.0 (API 21)
- **Target Version**: Android 13 (API 33)
- **Architecture**: Supports both 32-bit and 64-bit
- **Features**: Full feature support

### iOS
- **Minimum Version**: iOS 12.0
- **Target Version**: Latest iOS version
- **Devices**: iPhone and iPad support
- **Features**: Full feature support

## 🔧 Development Commands

### Development
```bash
npm start                    # Start Metro bundler
npm run android              # Run on Android
npm run ios                 # Run on iOS
npm run test                # Run tests
npm run lint                # Run linting
```

### Build
```bash
npm run build:android       # Build Android APK
npm run build:ios          # Build iOS app
```

### Testing
```bash
npm test                    # Run all tests
npm test:watch             # Run tests in watch mode
npm test:coverage          # Run tests with coverage
```

## 🚀 Deployment

### Android
1. **Generate Keystore**: Create signing key
2. **Configure Gradle**: Update build.gradle
3. **Build APK**: Generate release APK
4. **Upload to Play Store**: Deploy to Google Play

### iOS
1. **Configure Certificates**: Set up signing certificates
2. **Update Info.plist**: Configure app settings
3. **Build Archive**: Create iOS archive
4. **Upload to App Store**: Deploy to Apple App Store

## 🐛 Troubleshooting

### Common Issues

#### Metro Bundler Issues
```bash
# Clear Metro cache
npm start -- --reset-cache

# Clean project
npm run clean
```

#### Android Build Issues
```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Reinstall dependencies
npm install
```

#### iOS Build Issues
```bash
# Clean iOS build
cd ios
rm -rf Pods
rm -rf Podfile.lock
pod install
cd ..
```

### API Connection Issues
1. **Check API Server**: Ensure backend is running
2. **Verify URL**: Confirm API URL is correct
3. **Network Permissions**: Check network permissions
4. **CORS**: Ensure CORS is configured properly

## 📄 API Integration

### Endpoints Used
- `POST /api/auth/login` - Admin authentication
- `GET /api/admin/members` - Get all members
- `POST /api/admin/members` - Create new member
- `POST /api/admin/contributions` - Add contribution
- `GET /api/member/[accountNumber]` - Get member by account
- `GET /api/health` - Health check

### Response Handling
- **Success**: 2xx status codes
- **Errors**: Proper error messages and handling
- **Loading**: Loading states for async operations
- **Validation**: Form validation and error display

## 🤝 Contributing

### Development Workflow
1. **Fork Repository**: Create your own fork
2. **Create Branch**: Feature branch for changes
3. **Make Changes**: Implement your feature
4. **Test Changes**: Ensure everything works
5. **Submit PR**: Create pull request

### Code Style
- **ESLint**: Follow configured linting rules
- **TypeScript**: Use TypeScript for type safety
- **Comments**: Add meaningful comments
- **Testing**: Write tests for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Friends Development Society** - For the opportunity to build this system
- **React Native Community** - For the excellent framework and tools
- **Open Source Libraries** - For the amazing libraries used in this project

## 📞 Support

For support and questions:
- **Email**: support@fds-example.com
- **Issues**: Create an issue on GitHub
- **Documentation**: Check the wiki for detailed guides

---

Built with ❤️ for the Friends Development Society