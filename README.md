# 3D CellForge

Interactive 3D eukaryotic cell biology visualization for education. Built with React, Three.js (React Three Fiber), and Vite.

## Features

- 7 types of organelles (15 instances) with procedurally-generated 3D models
- Billboard text labels that always face the camera (toggle on/off)
- Click any organelle to see detailed information (Chinese + English)
- Smooth camera entrance animation and staggered organelle intro effects
- Semi-transparent cell membrane with Fresnel edge glow and internal fog
- UI controls: rotation reset, label toggle, organelle quick-jump list
- Mobile-optimized touch controls with adjusted sensitivity
- Loading progress bar
- Post-processing outline glow on selected organelle

## Tech Stack

- **React 19** + **Zustand** for state management
- **Three.js** via `@react-three/fiber` and `@react-three/drei`
- **@react-three/postprocessing** for outline effects
- **Vite 8** for fast dev/build

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`. Hot-reloads on changes.

### Build for Production

```bash
npm run build
```

Outputs static files to `dist/`. Deploy this folder to any static hosting (Vercel, Netlify, GitHub Pages, Nginx, etc.).

### Preview Production Build

```bash
npm run preview
```

Serves the built `dist/` folder locally for verification.

## Deployment

The `dist/` directory is a fully self-contained static site. Deploy it as-is:

- **Vercel / Netlify**: Connect your repo and set build command to `npm run build`, publish directory to `dist`.
- **GitHub Pages**: Push `dist/` contents to `gh-pages` branch.
- **Nginx / Apache**: Serve `dist/` as document root.
- **Docker**: Use `nginx:alpine` and copy `dist/` to `/usr/share/nginx/html`.

## Project Structure

```
src/
  App.jsx                 # Main app, Canvas setup, scene composition
  main.jsx                # React entry point
  index.css               # Global styles and animations
  components/
    CellMembrane.jsx      # Transparent membrane with Fresnel shader + fog
    Organelles.jsx        # All organelle types, configs, entrance animations
    InfoPanel.jsx         # Right-side info panel for selected organelle
    UIControls.jsx        # Left-side toolbar: reset, labels, jump list
    CameraAnimation.jsx   # Smooth initial camera dolly-in
    LoadingProgress.jsx   # Full-screen loading bar
  store/
    useCellStore.js       # Zustand store + ORGANELLE_DATA dictionary
  utils/
    organelleUtils.js     # ID-to-type mapping utility
```

## Controls

- **Mouse/Touch drag**: Rotate the cell
- **Scroll/Pinch**: Zoom in/out
- **Click organelle**: View details
- **Click empty space**: Deselect

## License

MIT
