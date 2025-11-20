# Echosketch - Unified Project with Authentication

## 🎯 Project Structure

This is a unified React application combining authentication and image generation into a single project.

### Pages

1. **Sign In Page** - `http://localhost:3000/#/signin`
2. **Sign Up Page** - `http://localhost:3000/#/signup`  
3. **Image Generation Page** - `http://localhost:3000/` (Protected - requires login)

## 📁 File Structure

```
Echosketch-Voice-to-Visuals-main/
├── index.tsx                    # App entry point with AuthProvider
├── AppRouter.tsx                # Main routing logic (NEW)
├── AppWithVoice.tsx            # Image Generation page (with logout)
├── pages/
│   ├── SignInPage.tsx          # Sign In page
│   └── SignUpPage.tsx          # Sign Up page
├── contexts/
│   └── AuthContext.tsx         # Authentication context
├── hooks/
│   └── useAuth.ts              # Custom hook for auth
├── components/
│   ├── VoiceToImagePanel.tsx   # Voice input & generation
│   ├── MetricsPanel.tsx        # Performance analytics
│   └── auth/
│       └── AuthLayout.tsx      # Auth pages layout
└── services/
    └── geminiService.ts        # AI image generation
```

## 🚀 How It Works

### 1. **Authentication Flow**

```
User visits localhost:3000
↓
Not logged in? → Redirect to #/signin
↓
Sign In → AuthContext stores user & token
↓
Redirect to / (Image Generation page)
```

### 2. **Routing System** (Hash-based)

- **AppRouter.tsx**: Main routing component
  - Listens to URL hash changes
  - Protects routes based on authentication
  - Redirects unauthenticated users to sign in
  
- **Routes**:
  - `#/signin` → SignInPage
  - `#/signup` → SignUpPage
  - `/` → AppWithVoice (protected)

### 3. **Authentication Context**

- **Location**: `contexts/AuthContext.tsx`
- **Storage**: localStorage
  - `echosketch-token` - Auth token
  - `echosketch-user` - User data
  - `echosketch-users` - Mock user database
  - `echosketch-saved` - Saved sketches

### 4. **User Session & Saved Images**

All generated images are automatically saved to the logged-in user's session:
- Stored in localStorage under `echosketch-saved`
- Persists across page refreshes
- Each sketch includes:
  - Original prompt
  - Enhanced prompt
  - Image URL
  - Timestamp

## 🛠️ Setup & Run

### Prerequisites
```bash
Node.js 18+
npm or yarn
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the App
```
Open: http://localhost:3000
```

## 📱 User Journey

### First Time User
1. Visit `http://localhost:3000`
2. Auto-redirect to Sign In page
3. Click "Sign up now" link
4. Create account
5. Auto-redirect to Image Generation page

### Returning User
1. Visit `http://localhost:3000`
2. Auto-redirect to Sign In page (if not logged in)
3. Enter credentials
4. Access Image Generation page
5. View saved sketches from previous sessions

### Logged In User
1. Direct access to Image Generation
2. Use voice/text input to generate images
3. Upload reference images
4. View performance analytics
5. Access saved sketches gallery
6. Logout from user menu (top-right)

## 🔐 Protected Routes

The Image Generation page (`/`) is protected:
- ✅ Accessible only when authenticated
- ❌ Redirects to sign in if not logged in
- 🔄 Auto-redirects to home after successful login

## 🎨 Features

### Sign In/Sign Up Pages
- ✅ Email & password authentication
- ✅ Password visibility toggle
- ✅ Error handling
- ✅ Loading states
- ✅ Navigation links between pages
- ✅ Gradient theme matching Echosketch branding

### Image Generation Page
- 🎤 **Voice Input** - Speech-to-text
- ✍️ **Text Input** - Manual prompts
- 🖼️ **Image Upload** - Reference images
- 🤖 **AI Generation** - Google Gemini
- 📊 **Performance Analytics** - Metrics dashboard
- 💾 **Saved Sketches** - Gallery view
- 👤 **User Menu** - Profile & logout

## 🔧 Technical Details

### Technologies Used
- **React 19** with TypeScript
- **Vite 6** - Build tool
- **Tailwind CSS** - Styling
- **Google Generative AI** - Image generation
- **Web Speech API** - Voice recognition
- **Hash-based routing** - Simple SPA routing

### No External Router Library
This project uses **hash-based routing** without React Router:
- Lightweight and simple
- No additional dependencies
- Perfect for single-page applications

### Authentication System
- **Mock authentication** (localStorage-based)
- Can be easily replaced with real backend API
- User data persists in browser

## 📝 Key Components

### AppRouter.tsx (NEW)
```typescript
- Handles all routing logic
- Protects image generation page
- Manages redirects based on auth state
- Shows loading spinner during auth check
```

### index.tsx (UPDATED)
```typescript
- Wraps app with AuthProvider
- Renders AppRouter instead of direct component
```

### AppWithVoice.tsx (UPDATED)
```typescript
- Added user menu with logout
- Shows logged-in user's email/name
- Logout redirects to sign in
```

## 🚦 Navigation Flow

```
           Start
             ↓
    ┌────────────────┐
    │  Not Logged In │
    └────────┬───────┘
             ↓
    ┌────────────────┐
    │  Sign In Page  │◄──────┐
    │  #/signin      │       │
    └────┬───────────┘       │
         │                   │
         ├─→ Sign Up Link    │
         │      ↓            │
    ┌────┴───────────┐       │
    │  Sign Up Page  │       │
    │  #/signup      │───────┘
    └────────┬───────┘
             │
      (After Login)
             ↓
    ┌────────────────────┐
    │ Image Generation   │
    │ Page (/)          │
    │                    │
    │ - Voice Input      │
    │ - Text Input       │
    │ - Upload Image     │
    │ - Generate         │
    │ - View Saved       │
    │ - Logout           │
    └────────────────────┘
```

## ✅ What Changed from Original

### Added Files
- ✅ `AppRouter.tsx` - Unified routing system

### Modified Files
- ✅ `index.tsx` - Wrapped with AuthProvider + AppRouter
- ✅ `AppWithVoice.tsx` - Added user menu with logout

### Unchanged (as requested)
- ✅ `SignInPage.tsx` - No changes to logic
- ✅ `SignUpPage.tsx` - No changes to logic
- ✅ `VoiceToImagePanel.tsx` - No changes to functionality
- ✅ `AuthContext.tsx` - No changes to auth logic
- ✅ All component designs preserved

## 🎯 Testing the Integration

1. **Start Fresh**
   ```bash
   # Clear localStorage to start clean
   # In browser console:
   localStorage.clear()
   ```

2. **Test Sign Up**
   - Go to `http://localhost:3000`
   - Should redirect to `#/signin`
   - Click "Sign up now"
   - Create account
   - Should auto-redirect to home

3. **Test Image Generation**
   - Speak or type a prompt
   - Generate an image
   - Check saved sketches at bottom
   - Logout from user menu

4. **Test Sign In**
   - After logout, should be at `#/signin`
   - Sign in with created account
   - Should see your saved sketches

## 🔄 Deployment

The project is configured for Vercel deployment:

```bash
# Build for production
npm run build

# Deploy
# Push to GitHub - Vercel auto-deploys
```

## 📞 Support

For issues or questions, check:
- Sign In/Sign Up pages have proper navigation links
- AuthContext is providing user data
- LocalStorage has `echosketch-token` after login
- Browser console for any errors

---

**Project Status**: ✅ Fully Integrated & Working

All three pages are now unified into a single React application with proper routing and authentication!
