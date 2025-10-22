# My Wall

A modern, real-time social wall application built with React and Supabase. Share your thoughts and images with instant updates!

![My Wall](https://img.shields.io/badge/React-19.1.1-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.76.0-green)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)

## ✨ Features

- 📝 Create text posts (up to 250 characters)
- 📷 Upload and share images
- ⚡ Real-time updates with Supabase Realtime
- 🎨 Modern, responsive UI
- 👤 Profile section with social links
- 🔄 Automatic feed refresh

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd my-wall
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Features](./FEATURES.md) - Complete feature documentation
- [Development Guide](./DEVELOPMENT_GUIDE.md) - Development workflow and best practices

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1, Vite 7.1.7
- **Backend**: Supabase (PostgreSQL + Storage + Realtime)
- **Styling**: Custom CSS
- **Language**: JavaScript (ES6+)

## 📦 Project Structure

```
my-wall/
├── src/
│   ├── components/
│   │   ├── CreatePost.jsx      # Post creation component
│   │   ├── Feed.jsx             # Feed container
│   │   ├── FeedPost.jsx         # Individual post component
│   │   ├── Header.jsx           # App header
│   │   └── Profile.jsx          # User profile sidebar
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # App entry point
│   └── supabase-client.js       # Supabase configuration
├── public/                      # Static assets
├── .env                         # Environment variables
└── package.json                 # Dependencies
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Danyael Dela Cruz**

- GitHub: [@danyaeldelacruz](https://github.com/danyaeldelacruz)
- LinkedIn: [danyaeldelacruz](https://linkedin.com/in/danyaeldelacruz)
- Email: contactdanyael@gmail.com

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI Library
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vite](https://vitejs.dev/) - Build Tool
