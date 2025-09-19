import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, Alert, ProgressBar, Badge } from 'react-bootstrap';

interface RealTimeTranslatorProps {
  documentText?: string;
  onTranslationComplete?: (translation: any) => void;
}

const RealTimeTranslator: React.FC<RealTimeTranslatorProps> = ({ 
  documentText, 
  onTranslationComplete 
}) => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [supportedLanguages, setSupportedLanguages] = useState<any>({});
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [translationStats, setTranslationStats] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Real-time translation timeout ref
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isRealTimeMode, setIsRealTimeMode] = useState(false);

  useEffect(() => {
    fetchSupportedLanguages();
    fetchTranslationStats();
    
    // Set document text if provided
    if (documentText) {
      setInputText(documentText);
    }
  }, [documentText]);

  // Real-time translation effect
  useEffect(() => {
    if (isRealTimeMode && inputText.trim() && inputText.length > 10) {
      // Clear existing timeout
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
      
      // Set new timeout for real-time translation
      translationTimeoutRef.current = setTimeout(() => {
        handleRealtimeTranslation();
      }, 1000); // 1 second delay after user stops typing
    }
    
    return () => {
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
    };
  }, [inputText, targetLanguage, isRealTimeMode]);

  const fetchSupportedLanguages = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/supported-languages-extended');
      const data = await response.json();
      if (data.success) {
        setSupportedLanguages(data.supported_languages);
      }
    } catch (error) {
      console.error('Error fetching supported languages:', error);
    }
  };

  const fetchTranslationStats = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/translation-stats');
      const data = await response.json();
      if (data.success) {
        setTranslationStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching translation stats:', error);
    }
  };

  const detectLanguage = async (text: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/detect-language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      if (data.success) {
        setDetectedLanguage(`${data.language_name} (${data.detected_language})`);
        return data.detected_language;
      }
    } catch (error) {
      console.error('Error detecting language:', error);
    }
    return 'en';
  };

  const handleRealtimeTranslation = async () => {
    if (!inputText.trim() || isTranslating) return;
    
    setIsTranslating(true);
    setError('');
    setTranslationProgress(10);
    
    try {
      // Detect language first if in auto mode
      let sourceLang = sourceLanguage;
      if (sourceLanguage === 'auto') {
        setTranslationProgress(20);
        sourceLang = await detectLanguage(inputText);
      }
      
      setTranslationProgress(40);
      
      // Perform real-time translation
      const response = await fetch('http://127.0.0.1:5000/realtime-translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          target_language: targetLanguage,
          source_language: sourceLang !== 'auto' ? sourceLang : undefined,
        }),
      });
      
      setTranslationProgress(80);
      
      const data = await response.json();
      if (data.success) {
        const translation = data.translation;
        setTranslatedText(translation.translated_text);
        setSuccess(`Translated in ${translation.translation_time.toFixed(2)}s using ${translation.service_used}`);
        
        // Call callback if provided
        if (onTranslationComplete) {
          onTranslationComplete(translation);
        }
        
        setTranslationProgress(100);
        
        // Clear progress after a delay
        setTimeout(() => setTranslationProgress(0), 1000);
      } else {
        setError(data.error || 'Translation failed');
        setTranslationProgress(0);
      }
    } catch (error) {
      setError(`Translation error: ${error}`);
      setTranslationProgress(0);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleManualTranslation = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate');
      return;
    }
    
    setIsTranslating(true);
    setError('');
    setSuccess('');
    setTranslationProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setTranslationProgress(prev => Math.min(prev + 10, 90));
    }, 200);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/translate-chunk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          target_language: targetLanguage,
          source_language: sourceLanguage !== 'auto' ? sourceLanguage : undefined,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setTranslatedText(data.translated_text);
        setSuccess(`Translation completed in ${data.translation_time.toFixed(2)}s`);
        setDetectedLanguage(`${supportedLanguages[data.source_language] || data.source_language}`);
        
        if (onTranslationComplete) {
          onTranslationComplete(data);
        }
      } else {
        setError(data.error || 'Translation failed');
      }
    } catch (error) {
      setError(`Translation error: ${error}`);
    } finally {
      clearInterval(progressInterval);
      setTranslationProgress(100);
      setIsTranslating(false);
      
      setTimeout(() => setTranslationProgress(0), 1000);
    }
  };

  const clearTranslation = () => {
    setInputText('');
    setTranslatedText('');
    setError('');
    setSuccess('');
    setDetectedLanguage('');
    setTranslationProgress(0);
  };

  const swapLanguages = () => {
    if (sourceLanguage !== 'auto' && translatedText) {
      setInputText(translatedText);
      setTranslatedText(inputText);
      setSourceLanguage(targetLanguage);
      setTargetLanguage(sourceLanguage);
    }
  };

  return (
    <Card className="real-time-translator" style={{ margin: '20px 0' }}>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">🌐 Real-Time Google Translator</h5>
        <div className="d-flex align-items-center gap-2">
          <Form.Check
            type="switch"
            id="realtime-switch"
            label="Real-time"
            checked={isRealTimeMode}
            onChange={(e) => setIsRealTimeMode(e.target.checked)}
          />
          {translationStats && (
            <Badge bg="info">
              {translationStats.available_services.length} services
            </Badge>
          )}
        </div>
      </Card.Header>
      
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        {/* Language Selection */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
          <Form.Select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="auto">Auto-detect</option>
            {Object.entries(supportedLanguages).map(([code, name]) => (
              <option key={code} value={code}>
                {String(name)}
              </option>
            ))}
          </Form.Select>
          
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={swapLanguages}
            disabled={sourceLanguage === 'auto' || !translatedText}
          >
            ⇄
          </Button>
          
          <Form.Select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            style={{ flex: 1 }}
          >
            {Object.entries(supportedLanguages).map(([code, name]) => (
              <option key={code} value={code}>
                {String(name)}
              </option>
            ))}
          </Form.Select>
        </div>
        
        {/* Progress Bar */}
        {translationProgress > 0 && (
          <ProgressBar 
            now={translationProgress} 
            animated 
            style={{ marginBottom: '15px' }}
            variant={translationProgress === 100 ? 'success' : 'primary'}
          />
        )}
        
        {/* Input and Output */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <Form.Label>
              Original Text 
              {detectedLanguage && (
                <Badge bg="secondary" className="ms-2">{detectedLanguage}</Badge>
              )}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              disabled={isTranslating}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <Form.Label>
              Translated Text
              {targetLanguage && supportedLanguages[targetLanguage] && (
                <Badge bg="primary" className="ms-2">
                  {supportedLanguages[targetLanguage]}
                </Badge>
              )}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={translatedText}
              readOnly
              placeholder="Translation will appear here..."
              style={{ backgroundColor: '#f8f9fa' }}
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="d-flex gap-2 mt-3">
          <Button
            variant="primary"
            onClick={handleManualTranslation}
            disabled={isTranslating || !inputText.trim()}
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </Button>
          
          <Button
            variant="outline-secondary"
            onClick={clearTranslation}
            disabled={isTranslating}
          >
            Clear
          </Button>
          
          {translatedText && (
            <Button
              variant="outline-success"
              onClick={() => navigator.clipboard.writeText(translatedText)}
            >
              Copy Translation
            </Button>
          )}
        </div>
        
        {/* Real-time Mode Info */}
        {isRealTimeMode && (
          <Alert variant="info" className="mt-3">
            <small>
              🔄 Real-time mode enabled: Translation will occur automatically 1 second after you stop typing.
            </small>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default RealTimeTranslator;