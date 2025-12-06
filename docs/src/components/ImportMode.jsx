import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { set as setIDB, get as getIDB } from 'idb-keyval';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';

// Configure PDF.js worker
// Use a CDN for the worker to avoid complex bundler configuration issues in Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ImportMode = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("ideal"); // ideal, success, error
    const [statusMsg, setStatusMsg] = useState("");
    const [importedCount, setImportCount] = useState(0);

    const processFile = async (file) => {
        if (file.type !== 'application/pdf') {
            setStatus("error");
            setStatusMsg("Please upload a valid PDF file.");
            return;
        }

        try {
            setProcessing(true);
            setProgress(0);
            setStatus("ideal");

            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument(arrayBuffer);
            const pdf = await loadingTask.promise;

            const totalPages = pdf.numPages;
            const newCards = [];
            const timestamp = Date.now();
            const sourceName = file.name.replace('.pdf', '');

            // Process each page
            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);

                // 1. Extract Text
                const textContent = await page.getTextContent();
                const lines = textContent.items.map(item => item.str).filter(line => line.trim().length > 0);

                // Heuristic: First line is title, rest description
                const title = lines.length > 0 ? lines[0] : `Page ${i}`;
                const description = lines.length > 1 ? lines.slice(1).join('\n') : "No description extracted.";

                // 2. Render Image
                const scale = 1.5;
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;

                // Convert to Data URL (JPEG for smaller size than PNG)
                const imagePath = canvas.toDataURL('image/jpeg', 0.8);

                newCards.push({
                    id: `custom_${timestamp}_${i}`,
                    title: title,
                    description: description,
                    imagePath: imagePath,
                    source: sourceName,
                    page: i,
                    isCustom: true
                });

                setProgress(Math.round((i / totalPages) * 100));
            }

            // Save to IndexedDB
            // We append to existing custom cards
            const existing = await getIDB('custom_cards') || [];
            const updated = [...existing, ...newCards];
            await setIDB('custom_cards', updated);

            // Note: We also need to notify App to reload, but standard way is usually window reload 
            // or providing a callback. For now user can switch modes or we can trigger an event?
            // LocalStorage trigger is easy if we used LS, but we use IDB. 
            // We'll just show success and ask user to refresh or switch topics.

            setImportCount(newCards.length);
            setStatus("success");
            setStatusMsg(`Successfully imported ${newCards.length} cards from ${file.name}.`);

        } catch (error) {
            console.error("Import Error:", error);
            setStatus("error");
            setStatusMsg("Failed to process PDF: " + error.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }, []);

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    };

    return (
        <div className="w-full h-full flex flex-col p-8 items-center justify-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                Import PDF Deck
            </h2>

            <div
                className={`
                    w-full max-w-2xl h-80 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center
                    transition-all duration-300 cursor-pointer relative overflow-hidden
                    ${isDragging ? 'border-blue-500 bg-blue-500/10 scale-105' : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-gray-500'}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {!processing && status !== 'success' && (
                    <div className="flex flex-col items-center text-gray-400 pointer-events-none">
                        <Upload size={64} className="mb-4 text-blue-400" />
                        <p className="text-xl font-medium text-gray-200">Drag & Drop PDF here</p>
                        <p className="text-sm mt-2">or click to browse</p>
                        <p className="text-xs mt-4 text-gray-500">Processing happens locally in your browser</p>
                    </div>
                )}

                {processing && (
                    <div className="flex flex-col items-center pointer-events-none z-10">
                        <div className="relative w-20 h-20 mb-4">
                            <Loader size={80} className="text-blue-500 animate-spin absolute" />
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-white">
                                {progress}%
                            </div>
                        </div>
                        <p className="text-lg text-blue-300 animate-pulse">Processing PDF...</p>
                        <p className="text-xs text-gray-500 mt-2">Rendering pages & extracting text</p>
                    </div>
                )}

                {status === 'success' && !processing && (
                    <div className="flex flex-col items-center text-green-400 pointer-events-none fade-in">
                        <CheckCircle size={64} className="mb-4" />
                        <p className="text-xl font-bold">Import Complete!</p>
                        <p className="text-gray-300 mt-2">{statusMsg}</p>
                        <p className="text-sm text-gray-500 mt-4">Refresh the page to see your new deck in "All" or under its filename.</p>
                    </div>
                )}

                {status === 'error' && !processing && (
                    <div className="flex flex-col items-center text-red-400 pointer-events-none fade-in">
                        <AlertCircle size={64} className="mb-4" />
                        <p className="text-xl font-bold">Import Failed</p>
                        <p className="text-gray-300 mt-2 max-w-md text-center">{statusMsg}</p>
                    </div>
                )}
            </div>

            <div className="mt-8 max-w-2xl text-gray-500 text-sm text-center">
                <p>
                    <strong>Note:</strong> Imported decks are saved to your browser's internal storage (IndexedDB).
                    They will persist on this device/browser but won't be visible to others.
                </p>
            </div>
        </div>
    );
};

export default ImportMode;
