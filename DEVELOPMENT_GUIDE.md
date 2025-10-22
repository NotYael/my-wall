# Development Guide

Guide for developers working on the My Wall application.

## Table of Contents

- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Supabase Integration](#supabase-integration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Best Practices](#best-practices)

## Development Environment

### Required Tools

- **Node.js**: v16+ ([Download](https://nodejs.org/))
- **Code Editor**: VS Code recommended
- **Browser**: Chrome/Firefox with DevTools
- **Git**: For version control

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Path Intellisense

### Setup

```bash
# Clone repository
git clone <repo-url>
cd my-wall

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Project Structure

```
my-wall/
├── public/                      # Static assets
│   └── vite.svg
├── src/
│   ├── assets/                  # Images and media
│   │   ├── github.png
│   │   ├── linkedin.png
│   │   ├── gmail.png
│   │   ├── profile-picture.jpg
│   │   └── react.svg
│   ├── components/              # React components
│   │   ├── CreatePost.jsx       # Post creation
│   │   ├── CreatePost.css
│   │   ├── Feed.jsx             # Posts feed container
│   │   ├── Feed.css
│   │   ├── FeedPost.jsx         # Individual post
│   │   ├── FeedPost.css
│   │   ├── Header.jsx           # App header
│   │   ├── Header.css
│   │   ├── Profile.jsx          # User profile
│   │   └── Profile.css
│   ├── App.jsx                  # Main app component
│   ├── App.css                  # App-level styles
│   ├── main.jsx                 # Entry point
│   ├── index.css                # Global styles
│   └── supabase-client.js       # Supabase config
├── .env                         # Environment variables (gitignored)
├── .gitignore
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.js               # Vite configuration
├── README.md                    # Project overview
├── SETUP.md                     # Setup instructions
├── FEATURES.md                  # Feature documentation
└── DEVELOPMENT_GUIDE.md         # This file
```

### File Organization

**Components**: One component per file

- `ComponentName.jsx` - Component logic
- `ComponentName.css` - Component styles

**Naming Conventions**:

- Components: PascalCase (`CreatePost.jsx`)
- CSS files: Match component name
- Utility files: camelCase (`supabase-client.js`)

## Code Style

### JavaScript/JSX

**Style Guide**: Airbnb React/JSX Style Guide (loosely)

**Key Points**:

- Use functional components with hooks
- Use arrow functions for event handlers
- Destructure props
- Use const/let (no var)
- Use template literals for strings

**Example**:

```jsx
import { useState } from "react";

function MyComponent({ title, onAction }) {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    onAction();
  };

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Count: {count}</button>
    </div>
  );
}

export default MyComponent;
```

### CSS

**Approach**: Component-scoped CSS (no CSS-in-JS)

**Guidelines**:

- Use class names, not IDs
- BEM-like naming: `.component-element-modifier`
- Group related styles
- Comment complex styles

**Example**:

```css
.create-post {
  padding: 20px;
  background: white;
}

.create-post-textarea {
  width: 100%;
  resize: none;
}

.create-post-button {
  background: #3b82f6;
}

.create-post-button:disabled {
  opacity: 0.6;
}
```

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

## Component Architecture

### Component Hierarchy

```
App
├── Header
├── Profile (sidebar, fixed)
└── Feed (main content)
    ├── CreatePost
    └── FeedPost (multiple instances)
```

### Component Patterns

#### 1. CreatePost (Form Component)

**Responsibilities**:

- Manage form state
- Handle file uploads
- Submit to Supabase
- Show loading states

**Key Hooks**:

- `useState`: Form data
- `useRef`: File input reference

#### 2. Feed (Container Component)

**Responsibilities**:

- Fetch posts from database
- Subscribe to real-time updates
- Render list of posts
- Handle loading/empty states

**Key Hooks**:

- `useState`: Posts array, loading state
- `useEffect`: Initial fetch + realtime subscription

#### 3. FeedPost (Presentational Component)

**Responsibilities**:

- Display post data
- Format dates
- Show images conditionally

**Props**:

- `post`: Object with {id, name, date, content, photo_url}

### Component Communication

**Props Down**:

```jsx
<FeedPost post={postData} />
```

**Events Up** (if needed):

```jsx
<CreatePost onPostCreated={handleNewPost} />
```

**Global State**: Not used (Supabase for data sync)

## State Management

### Local State (useState)

Used for component-specific data:

- Form inputs
- Loading states
- Selected files
- UI toggles

```jsx
const [text, setText] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
```

### Server State (Supabase)

Used for shared data:

- Posts list
- Real-time updates

```jsx
const [posts, setPosts] = useState([]);

useEffect(() => {
  fetchPosts();

  const subscription = supabase
    .channel("posts-changes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "posts" },
      () => fetchPosts()
    )
    .subscribe();

  return () => supabase.removeChannel(subscription);
}, []);
```

### Refs (useRef)

Used for DOM access:

- File input trigger
- No re-render on change

```jsx
const fileInputRef = useRef(null);

const openFilePicker = () => {
  fileInputRef.current?.click();
};
```

## Supabase Integration

### Client Configuration

**File**: `src/supabase-client.js`

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
```

### Common Operations

#### Insert Post

```javascript
const { data, error } = await supabase.from("posts").insert({
  name: "Author Name",
  body: "Post content",
  photo_url: imageUrl,
});
```

#### Fetch Posts

```javascript
const { data, error } = await supabase
  .from("posts")
  .select("*")
  .order("created_at", { ascending: false });
```

#### Upload Image

```javascript
const { data, error } = await supabase.storage
  .from("post-images")
  .upload(filePath, file);

const { data: urlData } = supabase.storage
  .from("post-images")
  .getPublicUrl(filePath);
```

#### Real-time Subscription

```javascript
const channel = supabase
  .channel("channel-name")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "posts" },
    (payload) => {
      console.log("Change detected:", payload);
      // Handle update
    }
  )
  .subscribe();

// Cleanup
return () => supabase.removeChannel(channel);
```

### Error Handling

```javascript
try {
  const { data, error } = await supabase.from("posts").insert(newPost);

  if (error) {
    console.error("Supabase error:", error);
    alert("Failed to create post");
    return;
  }

  // Success
  console.log("Created:", data);
} catch (error) {
  console.error("Unexpected error:", error);
  alert("An error occurred");
}
```

## Testing

### Manual Testing

**Test Checklist**:

- [ ] Create post (text only)
- [ ] Create post with image
- [ ] Verify character limit (250 chars)
- [ ] Check real-time updates (open 2 tabs)
- [ ] Test empty post submission (should block)
- [ ] Test image upload (various formats)
- [ ] Verify feed scrolling (profile stays fixed)
- [ ] Check responsive layout

### Browser Console

Monitor for:

- Supabase connection logs
- Real-time subscription status
- Upload errors
- Network requests

**Useful Console Commands**:

```javascript
// Check Supabase connection
localStorage.getItem("supabase.auth.token");

// Monitor realtime
// Look for "✅ New post detected" messages
```

### Network Tab

Check:

- API calls to Supabase
- Image uploads to storage
- Response times
- Error status codes

## Deployment

### Build Process

```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

### Deployment Platforms

#### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
4. Deploy

#### Netlify

1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables
5. Deploy

#### Manual (VPS/Server)

```bash
# Build
npm run build

# Serve dist/ folder with nginx/apache
# Or use: serve -s dist
```

### Environment Variables

**Production**:

- Add same vars as `.env` to hosting platform
- Never commit `.env` to git
- Use platform's secrets management

## Best Practices

### React

1. **Functional Components**: Always use functions + hooks
2. **Single Responsibility**: One component, one job
3. **Props Validation**: Document expected props
4. **Cleanup**: Always cleanup subscriptions/timers
5. **Keys**: Use stable IDs for list items (not index)

### Supabase

1. **Error Handling**: Always check for errors
2. **Realtime Cleanup**: Remove channels on unmount
3. **Storage Naming**: Use unique filenames (timestamp/random)
4. **Security**: Use RLS policies (even for public access)
5. **Queries**: Use indexes for large datasets

### Performance

1. **Avoid Re-renders**: Proper dependency arrays
2. **Images**: Use max-height to prevent layout shift
3. **Subscriptions**: One channel per component max
4. **Loading States**: Show feedback during async operations

### Security

1. **Env Vars**: Never expose secrets in code
2. **Input Validation**: Client + server-side
3. **File Uploads**: Validate file types
4. **SQL Injection**: Use Supabase client (parameterized)

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes, commit often
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
# Merge after review
```

### Commit Messages

Format: `type: description`

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructure
- `test`: Add tests
- `chore`: Maintenance

Examples:

```
feat: add image upload to posts
fix: resolve realtime subscription leak
docs: update setup guide
refactor: extract post form logic
```

## Troubleshooting

### Development Issues

**Hot reload not working**:

- Restart dev server
- Clear browser cache
- Check for syntax errors

**Supabase errors**:

- Verify `.env` variables
- Check Supabase project status
- Review RLS policies

**Images not uploading**:

- Check storage bucket exists
- Verify policies (INSERT/SELECT)
- Inspect network tab for errors

### Build Issues

**Build fails**:

- Run `npm run lint` to find errors
- Check for unused imports
- Verify all dependencies installed

**Environment vars not working**:

- Prefix with `VITE_`
- Restart after changing `.env`
- Check platform env var settings

## Resources

- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Supabase Docs](https://supabase.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)

## Getting Help

1. Check error messages carefully
2. Search existing issues
3. Review Supabase logs
4. Ask in discussions
5. Open detailed issue

---

**Happy Coding!** 🚀
