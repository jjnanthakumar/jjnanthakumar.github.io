# 👋 Nanthakumar J J — Personal Portfolio

A modern, fast, and fully open-source personal website to showcase my work as a **Technical Architect & Python Developer** and share my technical writings. Built with React, TypeScript, and Firebase.

![Website Preview](https://pub-2ab98e96400d470096cf10abb107a2c8.r2.dev/meta_data_folio_preview.png)

🔗 **Live Site**: [jjnanthakumar](https://jjnanthakumar.github.io)  
⭐️ **Star this repo** if you like it — or better, [contribute](#contributing) and be part of the project!

---

## 🚀 Features

- 🎯 **Portfolio**: Highlighting my selected projects with in-depth case studies
- ⚙️ **CMS Dashboard**: Built-in system to manage projects & certifications
- 📈 **Visitor Analytics**: Integrated with [Umami](https://umami.is)
- ⚡ **Optimized for Speed**: Powered by Vite for ultra-fast performance
- 📱 **Responsive Design**: Tailwind CSS for mobile-first layouts

---

## 🛠 Tech Stack

| Category       | Tech                                                  |
|----------------|-------------------------------------------------------|
| Frontend       | React 18, TypeScript, Vite                            |
| Styling        | Tailwind CSS, [shadcn/ui](https://ui.shadcn.dev)      |
| Content Layer  | MDX                                                   |
| Backend        | Firebase (Auth, Firestore, Storage)                  |
| Analytics      | Umami                                                 |

---

## 🧑‍💻 Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/jjnanthakumar/jjnanthakumar.github.io.git
cd jjnanthakumar.github.io
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Then fill in your Firebase and other credentials
```

4. **Start development server**
```bash
npm run dev
```

## Environment Setup

1. Copy `.env.example` to create your environment file:
	```bash
	cp .env.example .env.development   # For development
	cp .env.example .env.production    # For production
	```

2. Fill in the environment variables with your actual values:
	- Firebase configuration from your Firebase Console
	- Analytics IDs from your Umami dashboard
	- Other service-specific configurations

3. Never commit your actual `.env` files to version control

## Security Notes

- Keep your environment files secure and never commit them to version control
- Regularly rotate your API keys and access tokens
- Monitor your Firebase and reCAPTCHA usage for any suspicious activity
- Use environment-specific configurations for development and production

---

## 📂 Project Structure

```
src/
├── components/    # Reusable UI components
├── pages/         # Page components and routes
├── services/      # API and service integrations
├── lib/           # Utility functions
└── constants/     # Shared constants
```

---

## 🤝 Contributing

This project is open for contributions!

If you find bugs, have feature ideas, or want to improve the UI/UX, feel free to:
1. Fork the repo
2. Create a new branch
3. Submit a PR

I'll be happy to review and collaborate 💜

---

## License & Attribution  
This project is based on [wismannur.pro](https://github.com/wismannur/wismannur.pro) by [Wisnu Nurmochtar](https://github.com/wismannur), which was released under the **MIT License** (as stated in the original README).  

Modifications made by jjnanthakumar are also licensed under the MIT License.  
---

## 📬 Contact

- 🌐 Website: [jjnanthakumar](https://jjnanthakumar.github.io)
- 🐙 GitHub: [@jjnanthakumar](https://github.com/jjnanthakumar)
- 🐦 Twitter/X: [@jjnanthakumar](https://x.com/jjnanthakumar)
- 💼 LinkedIn: [jjnanthakumar](https://linkedin.com/in/jjnanthakumar)