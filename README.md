# Personal Portfolio Website

A modern, responsive portfolio website built with Next.js and TypeScript, showcasing my professional experience, projects, and technical skills.

![Portfolio Preview](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_C8558F09BD9B-1-ytq6xTxO8mGuilesKwoGu3stna2au0.jpeg)

## 🚀 Technologies Used

### Frontend Framework & Core
- **Next.js 14** - React framework with App Router for server-side rendering and routing
- **TypeScript** - For type-safe code and better developer experience
- **React** - UI library for building component-based interfaces

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Shadcn/ui** - Reusable component library built on Radix UI
- **Framer Motion** - For smooth animations and transitions
- **Lucide Icons** - Modern icon set for clean UI elements

### Development Tools
- **ESLint** - For code linting and maintaining code quality
- **Prettier** - Code formatter for consistent styling
- **Husky** - Git hooks for pre-commit formatting and linting

## ✨ Features

- **Responsive Design** - Fully responsive layout that works seamlessly across desktop, tablet, and mobile devices
- **Dark Mode** - System-preferred and manually toggleable dark/light theme
- **Modern UI** - Clean and modern interface with smooth animations
- **Server Components** - Utilizing Next.js 14's server components for optimal performance
- **SEO Optimized** - Meta tags and structured data for better search engine visibility
- **Type Safety** - Full TypeScript implementation for robust code
- **Accessibility** - WCAG compliant with proper ARIA labels and keyboard navigation

## 🛠️ Project Structure

\`\`\`
personal-portfolio/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── [...sections]/     # Other page sections
├── components/            # Reusable React components
│   ├── ui/               # UI components (shadcn)
│   └── sections/         # Page section components
├── lib/                   # Utility functions and helpers
├── styles/               # Global styles and Tailwind config
├── public/               # Static assets
└── types/                # TypeScript type definitions
\`\`\`



## 🎨 Customization

### Theme
The site uses Tailwind CSS for styling. You can customize the theme in the `tailwind.config.js` file:

\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Your custom colors
      },
      // Other theme extensions
    },
  },
}
\`\`\`

### Content
Update the content in the following files:
- `app/page.tsx` - Main landing page content
- `components/sections/` - Individual section content
- `public/` - Replace images and other static assets

## 📱 Mobile-First Approach

The portfolio is built with a mobile-first approach, ensuring:
- Responsive navigation with a collapsible sidebar
- Optimized images for different screen sizes
- Touch-friendly interactive elements
- Proper viewport settings and meta tags

## 🔍 SEO

The website implements various SEO best practices:
- Semantic HTML structure
- Meta tags and descriptions
- Structured data for better search engine understanding
- Optimized performance metrics
- Proper heading hierarchy

## 🌐 Performance

The website achieves excellent performance metrics:
- Server-side rendering for faster initial page loads
- Image optimization using Next.js Image component
- Minimal JavaScript bundle size
- Efficient component code-splitting
- Optimized fonts and icons

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🤝 Contributing

While this is a personal portfolio, suggestions and feedback are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📞 Contact

Feel free to reach out if you have any questions or would like to discuss collaboration opportunities.

---

Built with ❤️ using Next.js and TypeScript
\`\`\`

