# QR Code MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)](https://www.docker.com/)
[![Podman](https://img.shields.io/badge/Podman-Supported-blue.svg)](https://podman.io/)
[![Build and Release](https://img.shields.io/badge/Build%20and%20Release-Enabled-blue.svg)](https://github.com/antobrugnot/qrcode-mcp/actions)

[![MCP Badge](https://lobehub.com/badge/mcp-full/antobrugnot-qrcode-mcp)](https://lobehub.com/mcp/antobrugnot-qrcode-mcp)

Un serveur MCP (Model Context Protocol) pour générer des QR codes à partir de texte ou d'URLs en utilisant Node.js et TypeScript.

<a href="https://glama.ai/mcp/servers/@antoBrugnot/qrcode-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@antoBrugnot/qrcode-mcp/badge" alt="QR Code Server MCP server" />
</a>

## 🚀 Fonctionnalités

- **Génération de QR codes en multiple formats** : DataURL (base64), SVG, et affichage terminal
- **Options de personnalisation avancées** : Niveau de correction d'erreur, taille, marge, couleurs
- **Génération en lot** : Traiter plusieurs textes/URLs en une seule commande
- **Interface MCP standardisée** : Compatible avec tous les clients MCP
- **Support TypeScript complet** : Types sûrs et auto-complétion

## 📦 Installation

### Option 1: Docker/Podman (Recommandé) 🐳

**Prérequis**: Docker ou Podman installé sur votre système

```bash
# Avec Docker
docker pull antobrugnot/qrcode-mcp-server:latest

# Ou avec Podman (plus sécurisé, rootless)
podman pull antobrugnot/qrcode-mcp-server:latest

# Build local avec Docker
docker build -t qrcode-mcp-server .

# Build local avec Podman
podman build -t qrcode-mcp-server .
```

### Option 2: Installation locale

**Prérequis**:
- Node.js 18.0.0 ou supérieur
- npm ou yarn

```bash
# Cloner le projet
git clone <votre-repo>
cd qrcode-mcp

# Installer les dépendances
npm install

# Builder le projet
npm run build
```

## 🛠️ Utilisation

### Avec Docker/Podman (Recommandé)

```bash
# Avec Docker
docker run -i --rm antobrugnot/qrcode-mcp-server:latest

# Avec Podman (plus sécurisé)
podman run -i --rm antobrugnot/qrcode-mcp-server:latest

# Avec Docker Compose
docker-compose up qrcode-mcp-server

# Avec Podman Compose
podman-compose up qrcode-mcp-server

# Mode développement
docker-compose --profile dev up qrcode-mcp-dev
# ou
podman-compose --profile dev up qrcode-mcp-dev
```

### Développement local

```bash
# Mode développement avec rechargement automatique
npm run dev

# Ou en mode watch
npm run watch

# Builder pour la production
npm run build

# Lancer la version buildée
npm start
```

## 🔧 Outils MCP disponibles

### 1. `generate-qrcode-dataurl`

Génère un QR code et le retourne sous forme de Data URL (base64).

**Paramètres :**
- `text` (string, requis) : Le texte ou URL à encoder
- `options` (object, optionnel) : Options de génération
  - `errorCorrectionLevel` : 'L', 'M', 'Q', ou 'H' (défaut: 'M')
  - `width` : Largeur en pixels (50-2000)
  - `margin` : Marge en modules (0-10, défaut: 4)
  - `color.dark` : Couleur des modules sombres (défaut: '#000000')
  - `color.light` : Couleur de l'arrière-plan (défaut: '#FFFFFF')
  - `type` : Type MIME ('image/png', 'image/jpeg', 'image/webp')

**Exemple d'utilisation :**
```json
{
  "text": "https://github.com",
  "options": {
    "width": 300,
    "errorCorrectionLevel": "H",
    "color": {
      "dark": "#1f2937",
      "light": "#f3f4f6"
    }
  }
}
```

### 2. `generate-qrcode-svg`

Génère un QR code au format SVG.

**Paramètres :**
- `text` (string, requis) : Le texte ou URL à encoder
- `options` (object, optionnel) : Options de génération (similaires à dataurl)

**Exemple d'utilisation :**
```json
{
  "text": "Hello, World!",
  "options": {
    "width": 200,
    "margin": 2
  }
}
```

### 3. `generate-qrcode-terminal`

Génère un QR code pour affichage dans le terminal.

**Paramètres :**
- `text` (string, requis) : Le texte ou URL à encoder
- `options` (object, optionnel) :
  - `small` (boolean) : Utiliser le format compact (défaut: false)

**Exemple d'utilisation :**
```json
{
  "text": "Terminal QR Code",
  "options": {
    "small": true
  }
}
```

### 4. `generate-qrcode-batch`

Génère plusieurs QR codes en une seule opération (maximum 10).

**Paramètres :**
- `texts` (array[string], requis) : Tableau de textes/URLs à encoder (max 10)
- `format` (string, optionnel) : Format de sortie ('dataurl', 'svg', 'terminal', défaut: 'dataurl')
- `options` (object, optionnel) : Options de génération

**Exemple d'utilisation :**
```json
{
  "texts": [
    "https://github.com",
    "https://www.google.com",
    "Hello World"
  ],
  "format": "dataurl",
  "options": {
    "width": 200
  }
}
```

## 🎯 Utilisation avec des clients MCP

### Claude Desktop (ou Github Copilot)

> ℹ️ **Astuce GitHub Copilot** :  
> Pour GitHub Copilot, la clé `mcpServers` dans la configuration devient simplement `servers`.

#### Option 1: Avec Docker/Podman (Recommandé)

Ajoutez cette configuration à votre `claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "qrcode-generator": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "antobrugnot/qrcode-mcp-server:latest"]
    }
  }
}
```

**Ou avec Podman** (plus sécurisé, rootless) :

```json
{
  "mcpServers": {
    "qrcode-generator": {
      "command": "podman",
      "args": ["run", "-i", "--rm", "antobrugnot/qrcode-mcp-server:latest"]
    }
  }
}
```

#### Option 2: Installation locale

```json
{
  "mcpServers": {
    "qrcode-generator": {
      "command": "node",
      "args": ["/chemin/vers/qrcode-mcp/dist/index.js"]
    }
  }
}
```

### Autres clients MCP

Le serveur utilise le transport stdio standard et peut être utilisé avec n'importe quel client MCP compatible.

## 📋 Exemples d'utilisation

### Générer un QR code simple
```
Générez un QR code pour "https://github.com"
```

### QR code personnalisé
```
Générez un QR code pour "Mon site web" avec une largeur de 400px et des couleurs personnalisées (sombre: #2563eb, clair: #eff6ff)
```

### QR codes en lot
```
Générez des QR codes pour ces URLs : https://github.com, https://stackoverflow.com, https://nodejs.org
```

### QR code pour terminal
```
Générez un QR code terminal pour "Test terminal" en format compact
```

## 🔒 Sécurité

### Mesures de sécurité implémentées

- **Container sécurisé** : Utilisation d'un utilisateur non-root (UID 1001)
- **Image Alpine** : Image de base minimale pour réduire la surface d'attaque
- **Capabilities limitées** : Suppression de toutes les capabilities Linux non nécessaires
- **Read-only filesystem** : Container en lecture seule pour prévenir les modifications
- **Resource limits** : Limites CPU et mémoire pour éviter les attaques DoS
- **Security scanning** : Scan automatique des vulnérabilités avec Trivy
- **Dependency audit** : Vérification automatique des dépendances npm
- **Multi-stage build** : Build optimisé sans outils de développement en production

### Bonnes pratiques

- Utilisez toujours la dernière version taguée
- Vérifiez régulièrement les mises à jour de sécurité
- Surveillez les alertes GitHub Security
- Utilisez des secrets GitHub pour les tokens DockerHub

## 🔄 CI/CD

### Processus automatisé

- **Tests automatiques** : TypeScript, build et audits de sécurité
- **Build multi-architecture** : Support AMD64 et ARM64
- **Push automatique** : DockerHub avec tags appropriés
- **Scan de sécurité** : Trivy pour détecter les vulnérabilités
- **Release automatique** : GitHub Releases avec notes générées

### Variables d'environnement à configurer

```bash
# Dans GitHub Secrets
DOCKERHUB_TOKEN=your_dockerhub_token
```

## 🏗️ Architecture

```
qrcode-mcp/
├── .github/
│   └── workflows/        # GitHub Actions CI/CD
├── scripts/
│   └── release.sh        # Script de release
├── src/
│   └── index.ts          # Serveur MCP principal
├── dist/                 # Fichiers compilés
├── Dockerfile            # Configuration Docker
├── docker-compose.yml    # Orchestration Docker
├── .dockerignore         # Exclusions Docker
├── package.json          # Dépendances et scripts
├── tsconfig.json         # Configuration TypeScript
├── CONFIGURATION.md      # Guide de configuration
└── README.md            # Documentation
```

## 🔧 Technologies utilisées

- **Node.js** : Runtime JavaScript
- **TypeScript** : Typage statique
- **@modelcontextprotocol/sdk** : SDK MCP officiel
- **qrcode** : Bibliothèque de génération de QR codes
- **zod** : Validation de schémas

## 📝 Niveaux de correction d'erreur

- **L (Low)** : ~7% de récupération d'erreur
- **M (Medium)** : ~15% de récupération d'erreur (recommandé)
- **Q (Quartile)** : ~25% de récupération d'erreur
- **H (High)** : ~30% de récupération d'erreur

## 🐛 Dépannage

### Erreur "Module not found"
Assurez-vous d'avoir installé les dépendances :
```bash
npm install
```

### Erreur de compilation TypeScript
Vérifiez la configuration dans `tsconfig.json` et rebuilder :
```bash
npm run build
```

### Le serveur ne démarre pas
Vérifiez que Node.js 18+ est installé :
```bash
node --version
```

## 🚀 Release et Déploiement

### Créer une nouvelle release

```bash
# Utiliser le script de release
./scripts/release.sh v1.0.0

# Ou déclencher manuellement via GitHub Actions
# GitHub → Actions → Release → Run workflow
```

### Processus de release automatique

1. **Validation** : Tests, build et vérifications
2. **Versioning** : Mise à jour package.json et création du tag
3. **Docker Build** : Build et push multi-architecture
4. **Security Scan** : Analyse de sécurité avec Trivy
5. **GitHub Release** : Création avec notes automatiques
6. **Notification** : Confirmation du succès

### Images Docker disponibles

```bash
# Dernière version stable
docker pull antobrugnot/qrcode-mcp-server:latest

# Version spécifique
docker pull antobrugnot/qrcode-mcp-server:v1.0.0

# Version de développement (branch develop)
docker pull antobrugnot/qrcode-mcp-server:develop
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

### Processus de contribution

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commiter** vos changements (`git commit -m 'Add amazing feature'`)
4. **Pousser** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### Standards de code

- Utilisez TypeScript avec strict mode
- Suivez les conventions ESLint/Prettier
- Ajoutez des tests pour les nouvelles fonctionnalités
- Mettez à jour la documentation si nécessaire

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 🔗 Liens utiles

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [SDK TypeScript MCP](https://github.com/modelcontextprotocol/typescript-sdk)
- [Bibliothèque QRCode](https://github.com/soldair/node-qrcode)