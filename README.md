# RandomUser Generator - Documentazione Progetto

## Panoramica
RandomUser Generator è un'applicazione web moderna che consente di generare profili utente casuali con dati realistici. L'applicazione combina un'interfaccia utente elegante con animazioni fluide e funzionalità avanzate di visualizzazione dati.

## 🎨 Design e Interfaccia

### Logo
- **Creato da**: Progettato personalmente su Canva
- **Stile**: Design minimalista e moderno che riflette la natura del progetto
![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)



### Tema e Stile
L'applicazione presenta due temi principali:
1. **Tema Chiaro**: Bianco, azzurrino e beige
2. **Tema Scuro**: Nero, viola e blu scuro

### Elementi UI Unici
- **Cursor personalizzato**: Cursor animato con effetti di hover
- **Glassmorphism**: Effetti di vetro smerigliato su tutti i pannelli
- **Scrollbar personalizzata**: Stile unico con animazioni fluide
- **Transizioni fluide**: Effetti di transizione su tutti gli elementi interattivi

## 🛠️ Tecnologie Utilizzate

### Frontend
- **HTML5/CSS3**: Struttura e stili avanzati
- **JavaScript (ES6+)**: Logica dell'applicazione
- **Three.js (r128)**: Animazioni 3D e effetti visivi
- **Chart.js**: Visualizzazioni grafiche dei dati
- **Axios (v1.13.2)**: Gestione delle richieste HTTP

### API
- **RandomUser API**: Endpoint principale per la generazione di dati utente
  - URL: `https://randomuser.me/api/`
  - Formato: JSON
  - Funzionalità: Filtri per genere, nazionalità e quantità

## 🌟 Funzionalità Principali

### 1. Generazione Utenti
- **Filtri avanzati**:
  - Numero di utenti (1-50)
  - Genere (Maschio/Femmina/Tutti)
  - Nazionalità (6 paesi selezionabili)
- **Visualizzazione**: Card utente con foto e informazioni dettagliate
- **Navigazione**: Sistema di navigazione tra gli utenti generati

### 2. Sistema Mappa Interattiva
- **Mappa mondiale SVG** con bandiere cliccabili
- **Posizioni approssimate** per ogni paese selezionabile
- **Feedback visivo** per la selezione

### 3. Dashboard Statistiche
- **Metriche in tempo reale**:
  - Totale utenti generati
  - Età media
  - Paese più comune
  - Rapporto di genere
- **Grafici interattivi**:
  - Distribuzione per nazionalità (doughnut chart)
  - Distribuzione per età (bar chart)
- **Statistiche dettagliate**:
  - Utente più giovane/più anziano
  - Dominio email più comune
  - Paesi unici

### 4. Sfondo Animato
Sistema di sfondo dinamico con:
- **Gradienti animati** con 12 centri di movimento
- **Effetti di distorsione** basati sul movimento del mouse
- **Texture touch-sensitive** che risponde all'interazione
- **Schemi colore configurabili** (5 schemi predefiniti)

## 📁 Struttura del Progetto

```
project/
├── index.html          # Struttura principale
├── style.css           # Stili CSS completi
├── script.js           # Logica dell'applicazione
├── background.js       # Sistema sfondo animato con Three.js
├── axios.min.js        # Libreria HTTP
├── img/
│   └── logo.png        # Logo personalizzato
└── flags/              # Directory bandiere SVG
    ├── us.svg
    ├── fr.svg
    ├── ge.svg
    ├── ch.svg
    ├── br.svg
    └── au.svg
```

## 🎯 Fonti e Riferimenti

### Risorse Grafiche
1. **Sfondo Animato**:
   - Basato su: [Codepen di Cameron Knight](https://codepen.io/cameronknight/pen/ogxWmBP)
   - Modificato per: Effetti liquidi avanzati e interattività

2. **Stile Liquid Glass**:
   - Ispirato da: [Codepen di Fooontic](https://codepen.io/fooontic/pen/KwpRaGr)
   - Implementato con: Shader personalizzati e texture dinamiche

3. **Mappa Mondiale SVG**:
   - Fornitore: [Simplemaps](https://simplemaps.com/resources/svg-world)
   - Modifiche: Adattata per l'interattività e lo stile dell'app

4. **Bandiere SVG**:
   - Fornitore: [Flagpedia](https://flagpedia.net/download/svg)
   - Paesi inclusi: USA, Francia, Germania, Svizzera, Brasile, Australia

### Librerie e Framework
- **Three.js**: Per gli effetti 3D e le animazioni
- **Chart.js**: Per la visualizzazione dei dati statistici
- **Axios**: Per la gestione delle richieste API
- **Google Fonts**: Helvetica Neue per la tipografia

## 🚀 Caratteristiche Tecniche Avanzate

### Performance Optimization
- **Lazy Loading**: Caricamento asincrono delle immagini
- **Debouncing**: Ottimizzazione degli eventi di scroll e resize
- **Canvas Optimization**: Animazioni fluide con requestAnimationFrame
- **Mobile First**: Design completamente responsive

### Interattività
- **Touch Support**: Gestione ottimizzata per dispositivi mobili
- **Keyboard Navigation**: Supporto alla navigazione da tastiera
- **Smooth Scrolling**: Transizioni fluide tra sezioni
- **Real-time Updates**: Aggiornamenti in tempo reale delle statistiche

### Accessibilità
- **ARIA Labels**: Attributi per screen reader
- **Contrast Ratio**: Ottimizzato per la leggibilità
- **Focus States**: Indicatori visivi per la navigazione
- **Responsive Typography**: Testi scalabili per tutti i dispositivi

## 📱 Compatibilità

### Browser Supportati
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivi
- Desktop (Windows, macOS, Linux)
- Mobile (iOS, Android)
- Tablet (iPad, Android Tablet)

## 🔧 Installazione e Utilizzo

### Setup Locale
1. Clonare il repository
2. Aprire `index.html` in un browser moderno
3. Tutte le dipendenze sono incluse localmente

### Personalizzazione
- Modificare `style.css` per cambiare lo stile
- Aggiornare `background.js` per modificare gli effetti visivi
- Aggiungere nuove bandiere nella cartella `flags/`

## 📊 API Integration

### Endpoint Principale
```javascript
GET https://randomuser.me/api/
Parameters:
  ?results={number}
  &gender={male|female}
  &nat={country_code}
```

### Esempio di Risposta
```json
{
  "results": [{
    "gender": "female",
    "name": { "first": "Emma", "last": "Wilson" },
    "email": "emma.wilson@example.com",
    "picture": { "large": "https://..." },
    "location": { "city": "London", "country": "United Kingdom" },
    "dob": { "age": 28 },
    "nat": "GB"
  }]
}
```

## 🎨 Schemi Colore

### Schema 1 (Chiaro)
- Bianco puro: `#FFFFFF`
- Azzurrino chiaro: `#B3D9F2`
- Beige chiaro: `#F5EBD6`

### Schema 2 (Scuro)
- Nero-blu scuro: `#0A0E27`
- Viola scuro: `#4A0E4A`
- Blu notte: `#1A264D`

### Schemi 3-5
- Combinazioni di arancione, blu navy, turchese e teal

## 📝 Note di Sviluppo

### Best Practices Implementate
1. **Separation of Concerns**: HTML, CSS e JavaScript separati
2. **Modular Design**: Componenti riutilizzabili
3. **Error Handling**: Gestione degli errori dell'API
4. **Loading States**: Indicatori di caricamento per UX migliorata
5. **Local Storage**: Potenziale per salvare preferenze

### Future Implementazioni
- Esportazione dati in CSV/JSON
- Più filtri avanzati
- Temi personalizzabili dall'utente
- Supporto per più lingue
- Modalità offline con service workers

## 👥 Crediti

### Risorse
- Dati utente forniti da RandomUser API
- Icone SVG personalizzate
- Effetti visivi ispirati dalla community CodePen

##

---

**Nota**: Questo progetto è stato creato a scopo dimostrativo. Tutti i dati generati sono casuali e non rappresentano persone reali. L'API RandomUser è utilizzata secondo i termini del servizio.
