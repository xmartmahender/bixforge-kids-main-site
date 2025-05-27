# 🌟 BixForge Kids Zone - Main Website

A comprehensive educational platform designed specifically for children to learn coding, explore stories, and engage with interactive content in a safe and fun environment.

## 🚀 Features

### 📚 **Educational Content**
- **Code Stories**: Interactive coding tutorials for kids
- **Video Lessons**: Engaging video content for different age groups
- **Stories & Poems**: Creative content to inspire young minds
- **Age-Appropriate Filtering**: Content organized by age groups (0-3, 3-6, 6-9, 9-12)

### 💬 **Interactive Features**
- **Feedback System**: Real-time user feedback collection
- **Dynamic Blog**: Latest educational articles and tips
- **Subscription Packages**: Premium content access
- **Multi-language Support**: Content available in multiple languages

### 🎨 **Modern Design**
- **Responsive Design**: Works on all devices
- **Professional UI**: Clean and child-friendly interface
- **Fast Performance**: Optimized for speed and accessibility
- **SEO Optimized**: Search engine friendly

## 🛠️ Technology Stack

- **Framework**: Next.js 15.3.2 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Deployment**: Vercel-ready
- **Package Manager**: npm

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bixforge-kids-zone-main.git
   cd bixforge-kids-zone-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Authentication
   - Copy your Firebase config to `lib/firebase.ts`

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Firebase configuration
   ```

5. **Create Firebase indexes**
   - Open `create-firebase-indexes.html` in your browser
   - Click all "Create Index" buttons
   - Wait for indexes to be created

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── components/         # Reusable components
│   ├── (pages)/           # Page components
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   └── subscriptionService.ts # Business logic
├── public/                # Static assets
├── types/                 # TypeScript type definitions
└── create-firebase-indexes.html # Firebase index creator
```

## 🔥 Firebase Collections

The application uses the following Firestore collections:

- `blog_posts` - Blog articles and educational content
- `subscriptionPackages` - Premium subscription plans
- `userFeedback` - User feedback and support requests
- `stories` - Story content for children
- `videos` - Video content and metadata
- `code_stories` - Interactive coding tutorials

## 🌐 Deployment

### Deploy to Vercel

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - Add all Firebase configuration variables
   - Set `NODE_ENV=production`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Deploy to Other Platforms

The application is compatible with:
- Netlify
- AWS Amplify
- Google Cloud Platform
- Any Node.js hosting service

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Firestore Database
3. Set up security rules
4. Create required indexes using the provided tool

### Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Manual Testing
1. Test all navigation links
2. Submit feedback forms
3. Check responsive design
4. Verify Firebase integration
5. Test subscription flows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues
- **Firebase connection errors**: Check your Firebase configuration
- **Build failures**: Ensure all dependencies are installed
- **Index errors**: Use the Firebase Index Creator tool

### Getting Help
- Check the [Troubleshooting Guide](TROUBLESHOOTING_GUIDE.md)
- Use the [Site Diagnostic Tool](SITE_DIAGNOSTIC_TOOL.html)
- Open an issue on GitHub

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] AI-powered content recommendations
- [ ] Offline mode support
- [ ] Advanced parental controls

## 👥 Team

- **Development**: BixForge Solutions Team
- **Design**: UI/UX Design Team
- **Content**: Educational Content Team

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase team for the backend services
- Tailwind CSS for the styling system
- All contributors and testers

---

**🌟 Made with ❤️ for kids' education by BixForge Solutions**
