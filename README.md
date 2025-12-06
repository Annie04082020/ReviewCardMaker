# Review Card Maker

A tool to turn PDF slides into interactive flashcards for studying. It extracts images and titles from your lecture slides and presents them in a modern web application with a flip-card interface.

## Features

-   **Automatic Extraction**: Converts PDF slides into flashcards.
-   **Local PDF Import**: **[NEW]** Drag and drop PDF files directly in the browser to create new decks (saved locally).
-   **Smart Detection**: Identifies titles and content images, ignoring backgrounds.
-   **Web Interface**: Mobile-friendly, responsive design with smooth animations and **Collapsible Sidebar**.
-   **Review Mode**: Shuffle cards and track your progress.
-   **Quiz Mode**: Test yourself with detailed scoring, speed analysis (Reflex/Thinker), and mistake tracking. Customize length and time limits.
-   **Dictionary Mode**: Searchable plant database extracted from lecture PDFs. Includes a **Daily Recommendation** feature.
-   **Stats Dashboard**: Visual analysis of your "Weakest Decks" and improvements over time.

## Prerequisites

-   **Python 3.x**: For data extraction scripts.
-   **Node.js**: For the web application.

## Installation

1.  **Clone or Download** this repository.
2.  **Install Python Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Install Web App Dependencies**:
    ```bash
    cd docs
    npm install
    ```

## Usage

### 1. Generate Cards (Script Method)
1.  Place your lecture slide PDFs in `pdfs/`.
2.  Run the card extraction script:
    ```bash
    # Run from the root directory
    python pdf_to_data.py pdfs
    ```
    This creates `docs/public/cards/` and `docs/src/data/cards.json`.

### 2. Generate Dictionary (Optional)
1.  Place your dictionary/textbook PDFs in `dictionary/`.
2.  Run the dictionary extraction script:
    ```bash
    python dictionary_to_data.py
    ```
    This creates `docs/src/data/dictionary.json`.

### 3. Import PDFs (Browser Method)
1.  Start the app and click **Import PDF** in the sidebar.
2.  Drag and drop any PDF file.
3.  The app will process it instantly and save it as a "Custom Deck".

### 4. Start the App
1.  Go to the docs directory:
    ```bash
    cd docs
    ```
2.  Start the local server:
    ```bash
    npm run dev
    ```
3.  Open the link (usually `http://localhost:5173`) in your browser.

## Deployment to GitHub Pages

To view this app on your phone, deploy it to GitHub Pages using these steps:

1.  **Build the Project**:
    ```bash
    cd docs
    npm run build
    ```
2.  **Deploy the `dist` folder**:
    ```bash
    cd dist
    git init
    git add .
    git commit -m "Deploy update"
    git push -f https://github.com/Annie04082020/ReviewCardMaker.git gh-pages
    ```
3.  **Enable Pages**: Go to your GitHub Repository Settings -> Pages, and ensure it's serving from the `gh-pages` branch.
