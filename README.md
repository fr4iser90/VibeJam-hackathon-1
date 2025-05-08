# VibeJam Hackathon Setup

Dieses Repository enthält die Basis-Konfiguration für das VibeJam Hackathon-Projekt.

## 🚀 Schnellstart

### Option 1: Nix-Shell (Schnellste Entwicklung)
1. **Entwicklungsumgebung starten:**
   ```bash
   nix-shell
   ```

2. **Projekt initialisieren:**
   ```bash
   quick-start
   ```

3. **Entwicklungsserver starten:**
   ```bash
   dev-all  # Startet Frontend und Backend in tmux
   # Oder einzeln:
   dev-fe   # Nur Frontend
   dev-be   # Nur Backend
   ```

### Option 2: Docker (Konsistente Umgebung)
1. **Projekt initialisieren:**
   ```bash
   # Frontend initialisieren
   mkdir frontend
   cd frontend
   npm create vite@latest . -- --template react-ts
   cd ..

   # Backend initialisieren
   mkdir backend
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cd ..
   ```

2. **Docker starten:**
   ```bash
   docker-compose up --build
   ```

## 📁 Projektstruktur

```
.
├── .cursor/rules/          # AI-Rollen für Cursor
├── .vscode/               # Editor-Konfiguration
├── docker-compose.yml     # Docker-Setup
├── Dockerfile.backend     # Backend-Konfiguration
├── Dockerfile.frontend    # Frontend-Konfiguration
├── shell.nix             # Entwicklungsumgebung
├── .env.example          # Beispiel-Umgebungsvariablen
└── .gitignore           # Git-Konfiguration
```

## 🛠️ Entwicklung

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API-Docs: http://localhost:8000/docs

## 📝 Nützliche Befehle

### Nix-Shell Befehle
- `quick-start` - Initialisiert Frontend und Backend
- `dev-all` - Startet beide Server in tmux
- `dev-fe` - Startet Frontend-Server
- `dev-be` - Startet Backend-Server
- `fe-install` - Installiert Frontend-Abhängigkeiten
- `be-install` - Installiert Backend-Abhängigkeiten
- `clean-caches` - Bereinigt alle Caches

### Docker Befehle
- `docker-compose up --build` - Startet die Entwicklungsumgebung
- `docker-compose down` - Stoppt die Container
- `docker-compose logs -f` - Zeigt die Logs

## 🔧 Entwicklungsumgebung

### Nix-Shell
Die `shell.nix` stellt alle notwendigen Tools bereit:
- Node.js 20 + npm
- Python 3.11 + pip
- TypeScript + LSP
- Entwicklungstools (black, mypy, pylint)

### Docker
Die Docker-Konfiguration bietet:
- Isolierte Entwicklungsumgebung
- Konsistente Abhängigkeiten
- Einfache Deployment-Option 