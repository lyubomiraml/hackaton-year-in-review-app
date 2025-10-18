# Yearly Review App

A fun and interactive React application for creating personalized yearly reviews with photos, statistics, and AI integration.

## Features

- 📝 **Interactive Questionnaire**: Step-by-step questions covering romance, life events, trips, hobbies, and personal stats
- 📸 **Photo Upload**: Add photos to your memories and experiences
- 🎨 **Beautiful Presentation**: Generate stunning slideshow presentations from your answers
- 🤖 **AI Integration**: Send your data to AI services via webhook for enhanced insights
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **File API** for photo handling

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd /path/to/your/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## Configuration

### Webhook Integration

The app includes webhook integration for sending data to external services (like n8n). You can configure the webhook URL in the application or modify the default URL in `src/App.tsx`:

```typescript
const [webhookUrl, setWebhookUrl] = useState('YOUR_WEBHOOK_URL_HERE');
```

### Customization

- **Questions**: Modify the `questions` array in `App.tsx` to add, remove, or change questions
- **Styling**: Update Tailwind classes or modify `tailwind.config.js` for custom themes
- **Categories**: Add new question categories by updating the category field in questions

## Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts** to configure your deployment

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to Netlify via drag-and-drop or Git integration

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Build and deploy**
   ```bash
   npm run build
   npm run deploy
   ```

### Option 4: Static Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to any static hosting service (AWS S3, Firebase Hosting, etc.)

## Environment Variables

For production deployments, you might want to use environment variables for configuration:

Create a `.env` file:
```env
VITE_WEBHOOK_URL=your_webhook_url_here
VITE_APP_TITLE=Yearly Review App
```

Then use them in your code:
```typescript
const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || 'default_url';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue in the repository or contact the development team.

---

**Happy reviewing! 🎉✨**
