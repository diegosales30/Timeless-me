import React, { useState, useCallback, useRef } from 'react';
import { generateDecadeImage } from './services/geminiService';
import { DECADES } from './constants';
import { Decade, AppState } from './types';
import { Loader } from './components/Loader';
import { Icon } from './components/Icon';

const DecadeButton: React.FC<{
  decade: Decade;
  onClick: (decade: Decade) => void;
  disabled: boolean;
}> = ({ decade, onClick, disabled }) => (
  <button
    onClick={() => onClick(decade)}
    disabled={disabled}
    className="px-3 py-2 text-sm font-bold text-gray-800 bg-white rounded-md shadow-md transition-all duration-300 ease-in-out transform enabled:hover:bg-gray-200 enabled:hover:scale-105 disabled:bg-gray-600 disabled:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white"
  >
    {decade}
  </button>
);

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file.');
        setAppState(AppState.ERROR);
        return;
      }
      
      if (originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl);
      }

      setOriginalImageFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImageUrl(url);
      setAppState(AppState.IMAGE_SELECTED);
      setErrorMessage('');
    }
  };

  const handleDecadeSelect = useCallback(async (decade: Decade) => {
    if (!originalImageFile) return;

    setAppState(AppState.GENERATING);
    try {
      const resultUrl = await generateDecadeImage(originalImageFile, decade);
      setGeneratedImageUrl(resultUrl);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setErrorMessage(`Failed to generate image. ${message}`);
      setAppState(AppState.ERROR);
    }
  }, [originalImageFile]);

  const handleRestart = () => {
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }
    setAppState(AppState.INITIAL);
    setOriginalImageFile(null);
    setOriginalImageUrl(null);
    setGeneratedImageUrl(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const PolaroidFrame: React.FC<{ imageUrl: string | null, isResult?: boolean }> = ({ imageUrl, isResult }) => (
    <div 
        className={`bg-white p-4 pb-16 shadow-2xl w-full max-w-sm mx-auto transform transition-transform duration-300 ${isResult ? 'rotate-1' : '-rotate-2'}`}
        onClick={!imageUrl ? triggerFileInput : undefined}
    >
        <div className={`w-full aspect-square bg-gray-800 flex justify-center items-center ${!imageUrl && 'cursor-pointer'}`}>
            {imageUrl ? (
                <img src={imageUrl} alt={isResult ? "Generated result" : "Uploaded preview"} className="w-full h-full object-cover" />
            ) : (
                <div className="text-center text-gray-400 font-kalam">
                    <Icon name="camera" className="w-16 h-16 mx-auto text-gray-500"/>
                    <p className="mt-2 text-xl">UPLOAD PHOTO</p>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {appState === AppState.GENERATING && <Loader />}
      
      <header className="w-full max-w-2xl mx-auto my-8 text-center px-4 sm:px-6">
        <h1 className="text-6xl md:text-8xl text-white font-kalam">
            Timeless Me
        </h1>
        <p className="text-white text-md md:text-lg font-kalam mt-2">
            SEE YOURSELF THROUGH THE DECADES.
        </p>
      </header>

      <main className="w-full max-w-md mx-auto flex-grow flex flex-col justify-center px-4 sm:px-6 pb-8">
        <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="hidden"
        />

        {(appState === AppState.INITIAL || appState === AppState.IMAGE_SELECTED) && (
            <PolaroidFrame imageUrl={originalImageUrl} />
        )}
        
        {appState === AppState.INITIAL && (
            <p className="text-center text-white font-kalam text-xl mt-4 cursor-pointer" onClick={triggerFileInput}>
                Click to Begin
            </p>
        )}

        {appState === AppState.IMAGE_SELECTED && (
            <div className="text-center mt-6">
                <div className="mb-4">
                    <button
                        onClick={triggerFileInput}
                        className="text-gray-300 hover:text-white underline transition-colors duration-300"
                    >
                        Replace Photo
                    </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {DECADES.map(decade => (
                        <DecadeButton
                            key={decade}
                            decade={decade}
                            onClick={handleDecadeSelect}
                            disabled={false}
                        />
                    ))}
                </div>
            </div>
        )}

        {appState === AppState.RESULT && generatedImageUrl && (
          <div className="flex flex-col items-center gap-6">
            <PolaroidFrame imageUrl={generatedImageUrl} isResult />
            <div className="flex items-center gap-4 mt-4">
              <a
                href={generatedImageUrl}
                download="timeless-me.png"
                className="bg-white text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
              >
                <Icon name="download" className="w-6 h-6" />
                Download
              </a>
              <button
                onClick={handleRestart}
                className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
              >
                <Icon name="restart" className="w-6 h-6" />
                New Photo
              </button>
            </div>
          </div>
        )}

        {appState === AppState.ERROR && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-center">
                <div className="flex justify-center mb-2">
                    <Icon name="error" className="w-8 h-8 text-red-400"/>
                </div>
                <p className="text-red-300 font-semibold mb-4">{errorMessage}</p>
                <button
                    onClick={handleRestart}
                    className="bg-white text-gray-900 font-bold py-2 px-5 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2 mx-auto"
                >
                    <Icon name="restart" className="w-5 h-5"/>
                    Try Again
                </button>
            </div>
        )}
      </main>

      <footer className="w-full text-center py-5 mt-auto bg-gray-900 border-t border-gray-700">
        <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
            <span>Developed by</span>
            <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/felip.64bits/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors">
                <Icon name="instagram" className="w-5 h-5" />
                <span>@felip.64bits</span>
            </a>
            <a href="https://github.com/diegosales30" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors">
                <Icon name="github" className="w-5 h-5" />
                <span>diegosales30</span>
            </a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;