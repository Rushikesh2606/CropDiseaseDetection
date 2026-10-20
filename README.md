# PlantGuard AI — Crop Leaf Disease Detection System

PlantGuard AI is an end-to-end intelligent crop leaf disease detection platform designed to assist farmers, agronomists, and agricultural researchers with fast, calibrated leaf diagnosis across 15 crop conditions.

---

## 🌟 Key Features

- **Deep Learning Vision Engine**: Built on PyTorch using a fine-tuned ResNet-50 convolutional neural network.
- **Calibrated Confidence Scoring**: Uses temperature scaling to ensure realistic probability estimates, guarding against overconfident misclassifications.
- **Decision Safeguards & Thresholding**: Enforces strict confidence thresholds (default: 80%) with uncertainty warnings and top-3 differential diagnosis fallbacks.
- **FastAPI Asynchronous Backend**: High-throughput REST API with memory-only image handling, zero permanent image storage for privacy, and input validation against decompression bombs.
- **Modern React & Vite Frontend**: Responsive web interface styled with Tailwind CSS, smooth Web Animations API hero entrance, interactive disease encyclopedia, and real-time leaf diagnosis interface.
- **Agronomic Knowledge Base**: Comprehensive symptom guides, disease causes, management tips, and prevention strategies for each supported condition.

---

## 🌾 Supported Crops & Diseases (15 Conditions)

| Crop | Condition / Disease | Health Status |
| :--- | :--- | :--- |
| **Apple** | Apple Scab (*Venturia inaequalis*) | Diseased |
| **Apple** | Black Rot (*Diplodia seriata*) | Diseased |
| **Apple** | Cedar Apple Rust (*Gymnosporangium juniperi-virginianae*) | Diseased |
| **Apple** | Healthy Leaf | Healthy |
| **Corn (Maize)** | Cercospora Leaf Spot / Gray Leaf Spot (*Cercospora zeae-maydis*) | Diseased |
| **Corn (Maize)** | Common Rust (*Puccinia sorghi*) | Diseased |
| **Corn (Maize)** | Northern Leaf Blight (*Exserohilum turcicum*) | Diseased |
| **Corn (Maize)** | Healthy Leaf | Healthy |
| **Grape** | Black Rot (*Guignardia bidwellii*) | Diseased |
| **Grape** | Esca / Black Measles (*Phaeoacremonium* / *Phaeomoniella*) | Diseased |
| **Grape** | Leaf Blight / Isariopsis Leaf Spot (*Pseudocercospora vitis*) | Diseased |
| **Grape** | Healthy Leaf | Healthy |
| **Potato** | Early Blight (*Alternaria solani*) | Diseased |
| **Potato** | Late Blight (*Phytophthora infestans*) | Diseased |
| **Potato** | Healthy Leaf | Healthy |

---

## 🏗️ Architecture & Project Structure

```
Crop_disease/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI route handlers (health, predict, classes, diseases)
│   │   ├── data/            # Agronomic knowledge base (disease_info.json)
│   │   ├── services/        # Model inference & calibration service
│   │   ├── config.py        # Centralized environment configuration
│   │   ├── main.py          # FastAPI application factory & CORS setup
│   │   └── schemas.py       # Pydantic request/response models
│   ├── models/
│   │   ├── best_model.pth   # Trained PyTorch ResNet-50 weights (~90MB)
│   │   ├── classes.json     # Class label mapping
│   │   └── calibration.json # Temperature scaling parameter
│   ├── tests/               # Backend test suite (pytest)
│   └── requirements.txt     # Python backend dependencies
│
├── frontend/
│   ├── public/              # Static assets & background video
│   ├── src/
│   │   ├── components/      # Modular UI components (Hero, Analyzer, Layout, etc.)
│   │   ├── hooks/           # Custom React hooks (usePrediction, useHeroEntrance, etc.)
│   │   ├── pages/           # Pages (HomePage, AnalyzePage, DiseasesPage, DiseaseDetailPage)
│   │   ├── services/        # API client services
│   │   └── styles/          # Tailwind and custom CSS styles
│   ├── package.json         # Node.js dependencies and scripts
│   └── vite.config.js       # Vite configuration
│
├── .gitignore               # Ignored files (node_modules, venv, caches, builds)
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+ & npm**

---

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI development server
uvicorn app.main:app --reload --port 8000
```

The backend API will be running at `http://127.0.0.1:8000`.  
Interactive Swagger docs: `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will be running at `http://localhost:5173`.

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Build
```bash
cd frontend
npm run build
```

---

## 🛡️ Responsible Use & Advisory Disclaimer

PlantGuard AI is an assistive reference tool for educational and preliminary screening purposes. It is not a substitute for professional on-site agronomic advice or laboratory diagnostic testing. Always confirm suspected diagnoses with your local agricultural extension service or certified crop advisor before applying chemical or cultural treatments.
