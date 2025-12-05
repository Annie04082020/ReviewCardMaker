# Review Card Maker

A tool to turn PDF slides into interactive flashcards for studying. It extracts images and titles from your lecture slides and presents them in a modern web application with a flip-card interface.

## Features

-   **Automatic Extraction**: Converts PDF slides into flashcards.
-   **Smart Detection**: Identifies titles and content images, ignoring backgrounds.
-   **Web Interface**: Mobile-friendly, responsive design with smooth animations.
-   **Review Mode**: Shuffle cards and track your progress.

## Prerequisites

-   **Python 3.x**: For the data extraction script.
-   **Node.js**: For the web application.

## Installation

1.  **Clone or Download** this repository.
2.  **Install Python Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Install Web App Dependencies**:
    ```bash
    cd frontend
    npm install
    ```

## Usage

### 1. Generate Cards
1.  Place your PDF files in a folder (e.g., `pdfs/`).
2.  Run the extraction script:
    ```bash
    # Run from the root directory
    python pdf_to_data.py pdfs
    ```
    This will process all PDFs, extract images to `frontend/public/cards/`, and generate `frontend/src/data/cards.json`.

### 2. Start the App
1.  Go to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Start the local server:
    ```bash
    npm run dev
    ```
3.  Open the link (usually `http://localhost:5173`) in your browser.

## Deployment to GitHub Pages

To view this app on your phone, you can host it for free on GitHub Pages.

1.  **Initialize Git** (if not done):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  **Create a Repository** on GitHub.
3.  **Link Remote**:
    ```bash
    git remote add origin <your-github-repo-url>
    git branch -M main
    git push -u origin main
    ```
4.  **Deploy**:
    ```bash
    cd frontend
    npm run deploy
    ```
    (Note: The `deploy` script handles building and pushing to the `gh-pages` branch).

5.  **Enable Pages**: Go to your GitHub Repository Settings -> Pages, and ensure it's serving from the `gh-pages` branch.
