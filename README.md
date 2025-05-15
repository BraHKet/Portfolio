# Portfolio con React, Tailwind, Firebase e Vercel

Un sito web portfolio personale completo, progettato con un'estetica glassmorphism e un'architettura moderna. Include una dashboard amministrativa per la gestione dinamica dei progetti tramite Firebase.

## Caratteristiche

- **Design Glassmorphism**: Interfaccia elegante con effetti di sfocatura, trasparenze e gradienti
- **Completamente Responsive**: Layout mobile-first ottimizzato per tutti i dispositivi
- **Animazioni Fluide**: Transizioni ed effetti con Framer Motion
- **Architettura Moderna**: React con React Router per navigazione SPA
- **Firebase Integration**:
  - Autenticazione per l'area admin
  - Firestore per l'archiviazione dei dati
  - Regole di sicurezza personalizzate
- **Dashboard Amministrativa**:
  - Gestione completa CRUD dei progetti
  - Form con validazione
  - Interfaccia user-friendly
- **SEO Friendly**: Struttura ottimizzata per i motori di ricerca
- **Pronto per il Deploy**: Configurazione per Vercel con dominio personalizzato

## Struttura del Progetto

```
portfolio-website/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ProjectForm.jsx
│   │   ├── home/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── AboutSection.jsx
│   │   │   └── ServicesSection.jsx
│   │   └── projects/
│   │       ├── ProjectCard.jsx
│   │       ├── ProjectGrid.jsx
│   │       ├── ProjectDetail.jsx
│   │       └── ImageCarousel.jsx
│   ├── config/
│   │   └── firebase.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useFirestore.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── Admin.jsx
│   │   ├── Login.jsx
│   │   └── NotFound.jsx
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   └── animations.js
│   ├── App.jsx
│   └── index.js
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
└── vercel.json
```

## Stack Tecnologico

- **Frontend**: React 18, React Router 6
- **Styling**: Tailwind CSS, glassmorphism, animazioni con Framer Motion
- **Backend/Database**: Firebase (Auth, Firestore)
- **Deploy**: Vercel con supporto per dominio personalizzato

## Pagine Principali

1. **Home**: 
   - Hero section con presentazione
   - "Chi sono" con bio e skills
   - "Cosa faccio" con servizi offerti

2. **Progetti**:
   - Griglia di progetti caricati da Firestore
   - Filtro per tag
   - Animazioni di transizione e hover

3. **Dettaglio Progetto**:
   - Carousel di immagini
   - Dettagli completi del progetto
   - Link a repo e demo

4. **Admin Dashboard**:
   - Autenticazione sicura
   - Gestione dei progetti (CRUD)
   - Form con validazione real-time

## Installazione e Setup

1. Clona il repository:
   ```bash
   git clone https://github.com/your-username/portfolio-website.git
   cd portfolio-website
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Crea un file `.env` nella root del progetto con le tue credenziali Firebase:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

4. Avvia l'applicazione in modalità sviluppo:
   ```bash
   npm start
   ```

## Personalizzazione

- Modifica le informazioni personali nei componenti della Home
- Aggiorna i colori del tema nel file `tailwind.config.js`
- Personalizza le animazioni in `utils/animations.js`
- Aggiungi nuove sezioni o pagine secondo necessità

## Deploy

Consulta il file `DEPLOY_GUIDE.md` per istruzioni dettagliate sul deploy con Vercel e configurazione di un dominio personalizzato.

## Crediti

- React Icons - [https://react-icons.github.io/react-icons/](https://react-icons.github.io/react-icons/)
- Framer Motion - [https://www.framer.com/motion/](https://www.framer.com/motion/)
- Tailwind CSS - [https://tailwindcss.com/](https://tailwindcss.com/)
- Firebase - [https://firebase.google.com/](https://firebase.google.com/)
- Vercel - [https://vercel.com/](https://vercel.com/)
