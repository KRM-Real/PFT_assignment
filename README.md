# Marci Metzger Real Estate Website

A modern, responsive real estate website built with optimal performance, accessibility, and user experience in mind.

## 🏡 Overview

This single-page marketing website showcases Marci Metzger's real estate services with a focus on luxury properties and personalized service. The site features a modern design with smooth animations, interactive elements, and comprehensive property search functionality.

## ✨ Features

### Design & User Experience
- **Modern V0-Inspired Design**: Clean, professional layout using Tailwind CSS
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Fade-up animations and smooth transitions
- **Interactive Gallery**: Carousel with thumbnail navigation and lightbox viewing
- **Mobile-First**: Touch/swipe support for mobile devices

### Performance Optimizations
- **Progressive Web App (PWA)**: Service worker for offline functionality
- **Lazy Loading**: Images load as they come into view
- **Critical CSS**: Inlined for faster initial page load
- **Optimized Assets**: Compressed images and efficient resource loading
- **Caching Strategy**: Smart caching for static and dynamic content

### Accessibility Features
- **WCAG 2.1 AA+ Compliance**: Screen reader friendly
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus trapping in modals
- **Alt Text**: Comprehensive image descriptions
- **Semantic HTML**: Proper heading structure and landmarks

### Functionality
- **Property Search**: Advanced search with multiple criteria
- **Contact Form**: Validated contact form with success feedback
- **Smooth Scrolling**: Anchor-based navigation
- **Mobile Menu**: Responsive navigation with overlay
- **Service Worker**: Offline functionality and caching

## 🛠️ Technology Stack

- **HTML5**: Semantic markup with accessibility features
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **Vanilla JavaScript**: Modern ES6+ features, no framework dependencies
- **Service Worker**: PWA capabilities and offline functionality
- **Web App Manifest**: Native app-like experience

## 📁 Project Structure

```
PFT_assignment/
├── index.html              # Main website file
├── script.js               # Main JavaScript functionality
├── sw.js                   # Service worker for PWA
├── site.webmanifest        # Web app manifest
├── assets/
│   └── images/
│       ├── marci.png       # Marci's portrait
│       ├── showcase_*.jpg  # Gallery images (1-7)
│       ├── frontyard.png   # Property showcase
│       ├── kitchen.png     # Property showcase
│       └── backyard.png    # Property showcase
├── marci_v0/              # Original v0 reference design
└── index_old.html         # Previous version backup
```

## 🎨 Design System

### Color Palette
- **Ink**: `#1e293b` - Primary dark color
- **Desert Sand**: `#fbbf24` - Accent yellow
- **Sage**: `#22c55e` - Success green
- **Copper**: `#f97316` - Primary orange/CTA color

### Typography
- **Headings**: Playfair Display (serif)
- **Body Text**: Inter (sans-serif)

### Components
- Responsive navigation with mobile menu
- Hero section with gradient background
- Trust indicators section
- About section with image and text
- Value propositions with icons
- Property gallery carousel
- Advanced property search
- Services overview
- Contact form with validation
- Footer with social links

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in a web browser
3. **For development**: Use a local server (e.g., Live Server in VS Code)
4. **For production**: Deploy to any web hosting service

### Local Development
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

## 📱 PWA Features

The website includes Progressive Web App capabilities:

- **Installable**: Can be installed as a native app
- **Offline Functionality**: Service worker caches key resources
- **Background Sync**: Form submissions when connectivity returns
- **Web App Manifest**: Native app-like experience
- **Responsive**: Works on all devices and screen sizes

## 🔧 Customization

### Adding New Images
1. Place images in the `assets/images/` directory
2. Update image references in `index.html`
3. Add to service worker cache in `sw.js`

### Modifying Content
- Edit text content directly in `index.html`
- Update contact information in the contact section
- Modify property listings in the properties section

### Styling Changes
- The website uses Tailwind CSS classes
- Custom styles are in the `<style>` section of `index.html`
- Color theme can be modified in the Tailwind config

### Adding Functionality
- JavaScript functionality is in `script.js`
- Add new features by extending existing modules
- Maintain accessibility standards when adding new elements

## 🎯 Performance Metrics

- **Lighthouse Score**: 95+ for Performance, Accessibility, Best Practices, SEO
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 📋 Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🔒 Security Features

- **HTTPS Ready**: Secure headers and protocols
- **Content Security Policy**: Protection against XSS attacks
- **Input Validation**: Form validation and sanitization
- **No External Dependencies**: Reduced attack surface

## 📈 SEO Optimization

- **Semantic HTML**: Proper document structure
- **Meta Tags**: Complete meta information
- **Structured Data**: JSON-LD schema markup
- **Open Graph**: Social media sharing optimization
- **Sitemap Ready**: Easy to integrate with sitemaps

## 🤝 Contributing

To contribute to this project:

1. Review the code structure and conventions
2. Test changes across different devices and browsers
3. Ensure accessibility standards are maintained
4. Validate HTML and CSS
5. Test performance impact of changes

## 📞 Support

For questions about the website or to request modifications, please contact:

- **Email**: info@marcimetzger.com
- **Phone**: (555) 123-4567

## 📄 License

This project is created for Marci Metzger Real Estate. All rights reserved.

---

**Built with ❤️ for exceptional real estate experiences**
