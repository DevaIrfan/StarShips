# StarShips - Star Wars Encyclopedia PWA

A Progressive Web Application (PWA) for exploring and managing Star Wars starships.

## 📋 Project Information

- **Name**: Caesar Deva Irfan Putra
- **NIM**: 21120123130062
- **Group**: 5
- **Shift**: 1

## 🚀 Features

- ✅ **Home Page**: Browse all starships with search and pagination (9 items per page, 3 per row)
- ✅ **Factions Page**: Filter starships by faction (Rebel Alliance, Galactic Empire, Galactic Republic, CIS)
- ✅ **Add Starship**: Form to add new starships to the database
- ✅ **Detail Page**: View comprehensive information about each starship
- ✅ **About Page**: Developer information and app description
- ✅ **Bottom Navigation Bar**: Easy navigation between main sections
- ✅ **PWA Support**: Installable as a mobile app
- ✅ **Custom API**: Self-implemented API using localStorage for persistence

## 🛠️ Technology Stack

- **React JS** - UI Framework
- **JavaScript/TypeScript** - Programming Language
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Lucide React** - Icons
- **PWA** - Progressive Web App capabilities

## 📊 Data Structure

Each starship contains:
- **Factions**: Rebel Alliance, Galactic Empire, Galactic Republic, CIS
- **Corporation**: Manufacturer/builder
- **Ship Class**: Type of vessel
- **Image/GIF**: Visual representation
- **Shield Points**: Defensive capability
- **Hull Points**: Structural integrity
- **Armaments**: Weapons systems (array)
- **Description**: Detailed information

## 📱 Pages

1. **Home** (`/`) - All starships with search and pagination
2. **Factions** (`/factions/:faction`) - Filtered by faction
3. **Add Starship** (`/add`) - Form to add new ships
4. **Detail** (`/detail/:id`) - Comprehensive ship information
5. **About** (`/about`) - Developer and app information

## 🎨 Logo Customization

The app currently uses a placeholder rocket emoji (🚀) for the logo. To customize:

1. Create your logo images:
   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)

2. Place them in the `/public` folder

3. Update the logo display in:
   - `/components/HomePage.tsx`
   - `/components/AboutPage.tsx`

See `/public/LOGO_README.md` for detailed instructions.

## 🚀 Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── LOGO_README.md         # Logo instructions
├── src/
│   ├── main.tsx              # App entry point
│   └── index.css             # Global styles
├── components/
│   ├── HomePage.tsx          # Main home page
│   ├── FactionsPage.tsx      # Factions filter page
│   ├── AddStarshipPage.tsx   # Add new ship form
│   ├── DetailPage.tsx        # Ship detail view
│   ├── AboutPage.tsx         # About page
│   ├── BottomNavBar.tsx      # Bottom navigation
│   └── StarshipCard.tsx      # Reusable ship card
├── services/
│   └── starshipsApi.ts       # Custom API service
├── App.tsx                    # Main app component
└── index.html                # HTML entry point
```

## 🎯 API Functions

The custom API (`/services/starshipsApi.ts`) provides:

- `getAllStarships()` - Fetch all starships
- `getStarshipById(id)` - Get single starship
- `getStarshipsByFaction(faction)` - Filter by faction
- `searchStarships(query)` - Search functionality
- `addStarship(starship)` - Add new starship
- `getFactions()` - Get available factions

## 💾 Data Persistence

Data is stored in browser's localStorage with the key `starships_data`. The app includes 12 pre-seeded starships covering all 4 factions.

## 🎨 Color Scheme

- **Rebel Alliance**: Red to Orange gradient
- **Galactic Empire**: Gray to Dark Gray gradient
- **Galactic Republic**: Blue to Cyan gradient
- **CIS**: Dark Blue gradient

## 📝 Customization Notes

You can customize the app description in the About page (`/components/AboutPage.tsx`). Look for the placeholder text and replace it with your own description.

## 🌟 PWA Features

- Offline support via Service Worker
- Installable on mobile devices
- App-like experience
- Custom app icon and theme color

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1280px+)
- Tablet (768px - 1279px)
- Mobile (< 768px)

## 🔧 Development Notes

- Uses localStorage for data persistence (simulates backend API)
- All content is in English
- Bottom navigation is fixed and always visible
- Search works across name, faction, corporation, and ship class
- Pagination shows 9 items per page in a 3x3 grid

## 📄 License

This project is for educational purposes.

---

Made with ⚡ by Caesar Deva Irfan Putra
