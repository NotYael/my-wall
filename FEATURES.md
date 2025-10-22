# Features Documentation

Complete documentation of all features in the My Wall application.

## Table of Contents

- [Core Features](#core-features)
- [User Interface](#user-interface)
- [Technical Features](#technical-features)
- [Future Enhancements](#future-enhancements)

## Core Features

### 1. Post Creation

Create posts with text and optional images.

**Specifications:**

- **Text Input**:
  - Maximum 250 characters
  - Real-time character counter
  - Auto-disabled when empty
- **Image Upload**:
  - Click 📷 button to select image
  - Accepts: `image/*` (jpg, png, gif, etc.)
  - Button shows ✅ when image selected
  - Images uploaded to Supabase Storage
- **Validation**:
  - Cannot submit empty post
  - Character limit enforced client-side
  - Database constraint: 280 characters (safety buffer)

**User Flow:**

1. Type your message (up to 250 characters)
2. (Optional) Click 📷 to add an image
3. Click "Share" button
4. Post appears instantly in feed

**Technical Details:**

- Component: `CreatePost.jsx`
- Database: Inserts to `posts` table
- Storage: Uploads to `post-images` bucket
- Real-time: Triggers feed refresh via Supabase Realtime

### 2. Feed Display

View all posts in reverse chronological order (newest first).

**Features:**

- **Post Information**:
  - Author name
  - Creation date (formatted: "October 22, 2025")
  - Post content
  - Attached image (if any)
- **Mock Posts**:
  - 3 sample posts for demonstration
  - Combined with database posts
  - Database posts appear first
- **Styling**:
  - Card-based layout
  - Hover effects (shadow elevation)
  - Responsive images (max 400px height)
  - Rounded corners

**Technical Details:**

- Component: `Feed.jsx`, `FeedPost.jsx`
- Data source: Supabase `posts` table + mock data
- Ordering: `created_at DESC`

### 3. Real-time Updates

Posts appear instantly without manual refresh.

**How it Works:**

1. User creates a post
2. Post saved to database
3. Supabase Realtime detects INSERT event
4. Feed component receives notification
5. Feed automatically re-fetches data
6. New post appears for all viewers

**Technical Details:**

- Uses Supabase Realtime channels
- Event: `postgres_changes` on `posts` table
- Subscription cleanup on component unmount
- Works in multiple browser tabs/windows

**Setup Required:**

- Enable Realtime on `posts` table in Supabase
- Channel subscription in `Feed.jsx`

### 4. Image Upload & Display

Upload images with posts and view them in feed.

**Upload Process:**

1. User selects image via file picker
2. Image uploaded to Supabase Storage
3. Unique filename generated (prevents conflicts)
4. Public URL stored in database
5. Image displayed in feed

**Specifications:**

- **Storage**: Supabase Storage bucket (`post-images`)
- **File Naming**: Random filename with original extension
- **Public Access**: Images viewable by anyone
- **Display**:
  - Full width in post card
  - Max height: 400px
  - Object-fit: cover
  - Rounded corners

**Technical Details:**

- Upload: `supabase.storage.from('post-images').upload()`
- URL: `supabase.storage.from('post-images').getPublicUrl()`
- Database: Stores URL in `photo_url` column

### 5. Profile Section

Displays user information and social links.

**Content:**

- Profile picture
- Name: "Danyael Dela Cruz"
- Bio/Description
- Social links:
  - GitHub
  - LinkedIn
  - Gmail/Email

**Features:**

- Fixed sidebar (doesn't scroll with feed)
- Social link icons with hover effects
- Responsive layout

**Technical Details:**

- Component: `Profile.jsx`
- CSS: Fixed position with overflow hidden
- Assets: Images stored in `src/assets/`

## User Interface

### Layout

```
┌─────────────────────────────────────────┐
│            Header                        │
├──────────┬──────────────────────────────┤
│          │  Create Post                 │
│ Profile  │  ├─ Text Input               │
│ (Fixed)  │  └─ Image Upload Button      │
│          │                               │
│          │  Feed                         │
│          │  ├─ Post 1 (newest)          │
│          │  ├─ Post 2                   │
│          │  ├─ Post 3                   │
│          │  └─ ...                       │
│          │  (Scrollable)                │
└──────────┴──────────────────────────────┘
```

### Styling

**Color Scheme:**

- Background: White (`#ffffff`)
- Primary: Blue (`#3b82f6`)
- Text: Gray shades (`#1f2937`, `#374151`, `#6b7280`)
- Borders: Light gray (`#e5e7eb`, `#d1d5db`)

**Typography:**

- Font: System default (inherits)
- Sizes:
  - Post content: 1rem
  - Author: 1.05rem (semi-bold)
  - Date: 0.8rem
  - Character counter: 0.75rem

**Components:**

- Border radius: 8px - 12px (rounded)
- Shadows: Subtle (elevation on hover)
- Transitions: 0.2s ease

### Responsive Design

- Container: Max width with margins
- Profile: Fixed width (20%, max 250px)
- Feed: Flexible, takes remaining space
- Images: 100% width, max height constraint

## Technical Features

### Database

**Posts Table Schema:**

```sql
- id: UUID (primary key, auto-generated)
- user_id: UUID (nullable, for future auth)
- name: TEXT (author name)
- body: TEXT (post content, max 280 chars)
- created_at: TIMESTAMP (auto-generated)
- photo_url: TEXT (nullable, image URL)
```

**Constraints:**

- Body length: ≤ 280 characters
- ID: Auto-generated UUID
- Timestamp: Auto-set to current time

### Storage

**Bucket: `post-images`**

- Type: Public
- Policies:
  - INSERT: Allow all users
  - SELECT: Allow all users
- File naming: Random (prevents overwrites)
- Access: Public URLs

### State Management

**React State:**

- `postContent`: Text input value
- `selectedImage`: Selected image file
- `isSubmitting`: Submit loading state
- `posts`: Array of post objects

**No External State Library:**

- Uses built-in React hooks (`useState`, `useEffect`, `useRef`)
- Props passed between components
- Real-time sync via Supabase

### Performance

**Optimizations:**

- Character limit prevents large text submissions
- Image max height prevents layout shift
- Realtime subscription with cleanup
- Minimal re-renders (proper state management)

**Loading States:**

- Button disabled during submission
- "Sharing..." text feedback
- Textarea disabled when posting

## Future Enhancements

### Planned Features

1. **User Authentication**

   - Sign up / Log in
   - User-specific feeds
   - Edit/delete own posts

2. **Image Improvements**

   - Image preview before upload
   - Drag & drop upload
   - Multiple images per post
   - Image compression

3. **Interaction Features**

   - Like/reaction system
   - Comments on posts
   - Share posts

4. **UI Enhancements**

   - Dark mode
   - Custom themes
   - Emoji picker
   - Rich text formatting

5. **Advanced Features**

   - Search/filter posts
   - Hashtags
   - @mentions
   - Notifications

6. **Performance**
   - Infinite scroll/pagination
   - Image lazy loading
   - Caching strategy

### Contributing

Want to add a feature?

1. Fork the repository
2. Create a feature branch
3. Implement the feature
4. Submit a pull request

See [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) for development workflow.

---

**Questions or Suggestions?** Open an issue on GitHub!
