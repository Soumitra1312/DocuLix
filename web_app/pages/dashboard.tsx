import { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import navIcon1 from '../public/assets/img/nav-icon1.svg';
import navIcon2 from '../public/assets/img/nav-icon2.svg';
import navIcon3 from '../public/assets/img/nav-icon3.svg';
import Link from "next/link";
import axios from 'axios';
import Head from 'next/head';
import styles from './dashboard.module.css';

const FileUpload: React.FC = () => {
  const [selectedResponse, setSelectedResponse] = useState<string>('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [questionMode, setQuestionMode] = useState(''); // 'predefined' or 'custom'
  const [showQuestionOptions, setShowQuestionOptions] = useState(false);
  
  // New state for PDF processing workflow
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChunking, setIsChunking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [fileHash, setFileHash] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [processingStats, setProcessingStats] = useState<any>(null);
  const [isPdfReady, setIsPdfReady] = useState(false);
  
  // Enhanced processing states
  const [chunkingProgress, setChunkingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  
  // Navbar state
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value: string) => {
    setActiveLink(value);
  }

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/questionsshort'); // Replace with your Flask API endpoint
      const data = await response.json();
      console.log(data);
      setQuestions(data);
    } catch (error) {
      console.log('Error fetching questions:', error);
    }
  };
  const handleQuestionModeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setQuestionMode(value);
    setShowQuestionOptions(value !== '');
    setSelectedQuestion('');
    setCustomQuestion('');
  };

  const handlePredefinedQuestionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuestion(event.target.value);
  };

  const handleCustomQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomQuestion(event.target.value);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setIsProcessing(true);
    setIsChunking(false);
    setShowSuccess(false);
    setIsPdfReady(false);
    setUploadedFileName(file.name);
    setUploadedFiles([]);
    setChunkingProgress(0);
    setCurrentStep('📤 Uploading document to server...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Uploading and processing document...');
      
      const response = await fetch('http://127.0.0.1:5000/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      
      // Once upload is complete, start chunking animation
      setIsUploading(false);
      setIsChunking(true);
      setCurrentStep('🧠 Analyzing document structure...');
      setChunkingProgress(25);
      
      const data = await response.json();
      console.log('Document processing response:', data);
      
      if (data.success) {
        // Simulate progressive chunking steps if not cached
        if (!data.cached) {
          await new Promise(resolve => setTimeout(resolve, 800));
          setCurrentStep('📄 Extracting text content...');
          setChunkingProgress(50);
          
          await new Promise(resolve => setTimeout(resolve, 800));
          setCurrentStep('✂️ Creating intelligent chunks...');
          setChunkingProgress(75);
          
          await new Promise(resolve => setTimeout(resolve, 800));
          setCurrentStep('🔍 Indexing for optimal search...');
          setChunkingProgress(90);
          
          await new Promise(resolve => setTimeout(resolve, 600));
        } else {
          setCurrentStep('📋 Loading from cache...');
          setChunkingProgress(100);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        setCurrentStep('✅ Document processing complete!');
        setChunkingProgress(100);
        
        setFileHash(data.file_hash);
        
        // Check if validation is required
        if (data.validation_required) {
          // Continue with validation animation
          setCurrentStep('🤖 AI: Identifying document type...');
          setChunkingProgress(100);
          
          // Update UI with chunking success
          const textarea = document.getElementById('response') as HTMLTextAreaElement;
          if (textarea) {
            textarea.value = `✅ Document chunked successfully!\n\nFile: ${file.name}\nChunks Created: ${data.chunks_count}\nText Length: ${data.text_length} characters\n\n🤖 AI is analyzing document type...`;
          }
          
          // Call validation endpoint
          try {
            const validationResponse = await fetch('http://127.0.0.1:5000/validate-document', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                file_hash: data.file_hash
              })
            });
            
            const validationData = await validationResponse.json();
            
            if (validationData.success && validationData.is_legal_document) {
              // Document is legal - proceed
              setProcessingStats({
                cached: false,
                chunksCount: data.chunks_count,
                processingTime: data.processing_time || 0,
                textLength: data.text_length,
                simplifiedChunksCount: data.simplified_chunks_count || data.chunks_count
              });
              setIsPdfReady(true);
              setCurrentStep('✅ Legal document validated!');
              
              // Show success
              setTimeout(() => {
                setIsChunking(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
              }, 1000);
              
              // Update UI with validation success
              if (textarea) {
                textarea.value = `✅ Document validated successfully!\n\nFile: ${file.name}\nDocument Type: ${validationData.document_type}\nAI Analysis: ${validationData.ai_explanation}\n\nReady to answer legal questions!`;
              }
            } else {
              // Document is not legal - show error
              throw new Error(validationData.ai_explanation || validationData.error || 'Document validation failed');
            }
          } catch (validationError) {
            console.error('Validation error:', validationError);
            throw validationError;
          }
        } else {
          // Original flow for cached documents
          setProcessingStats({
            cached: data.cached,
            chunksCount: data.chunks_count,
            processingTime: data.processing_time || 0,
            textLength: data.text_length,
            simplifiedChunksCount: data.simplified_chunks_count || data.chunks_count
          });
          setIsPdfReady(true);
          
          // Show success animation briefly
          setIsChunking(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
          
          // Update UI with success message
          const textarea = document.getElementById('response') as HTMLTextAreaElement;
          if (textarea) {
            if (data.cached) {
              textarea.value = `✅ Document loaded from cache!\n\nFile: ${file.name}\nChunks: ${data.chunks_count}\nReady to answer questions.`;
            } else {
              textarea.value = `✅ Document processed successfully!\n\nFile: ${file.name}\nText Length: ${data.text_length} characters\nChunks Created: ${data.chunks_count}\nSimplified Chunks: ${data.simplified_chunks_count || data.chunks_count}\nProcessing Time: ${data.processing_time}s\n\nReady to answer questions!`;
            }
          }
        }
      } else {
        throw new Error(data.error || 'Failed to process document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      
      // Enhanced error handling for legal document validation
      const errorMessage = String(error);
      if (errorMessage.includes('does not appear to be a legal document')) {
        const errorDetails = `⚠️ LEGAL DOCUMENT VALIDATION FAILED\n\n${errorMessage}\n\nPlease upload documents such as:\n• Contracts and Agreements\n• Legal Briefs and Motions\n• Statutes and Regulations\n• Court Documents\n• Legal Opinions\n• Terms of Service\n• Privacy Policies\n• And other legal texts`;
        
        const textarea = document.getElementById('response') as HTMLTextAreaElement;
        if (textarea) {
          textarea.value = errorDetails;
        }
        alert('⚠️ Please upload a legal document for analysis');
      } else {
        alert('Error processing document: ' + error);
      }
      
      setIsPdfReady(false);
      setCurrentStep('❌ Processing failed');
    } finally {
      setIsUploading(false);
      setIsChunking(false);
      // Keep processing true briefly to show success state
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep('');
        setChunkingProgress(0);
      }, showSuccess ? 2000 : 0);
    }
  };

  const handleMultipleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    setIsUploading(true);
    setIsProcessing(true);
    setIsChunking(false);
    setShowSuccess(false);
    setIsPdfReady(false);
    setUploadedFiles(fileArray.map(file => file.name));
    setChunkingProgress(0);
    setCurrentStep(`📤 Uploading ${files.length} document(s) to server...`);
    
    try {
      const formData = new FormData();
      
      // Append all files to FormData
      fileArray.forEach((file, index) => {
        formData.append('files', file);
      });
      
      console.log(`Uploading and processing ${files.length} documents...`);
      
      const response = await fetch('http://127.0.0.1:5000/upload-multiple', {
        method: 'POST',
        body: formData,
      });
      
      // Once upload is complete, start chunking animation
      setIsUploading(false);
      setIsChunking(true);
      setCurrentStep('🧠 Analyzing document structures...');
      setChunkingProgress(25);
      
      const data = await response.json();
      console.log('Multiple documents processing response:', data);
      
      if (data.success) {
        // Simulate progressive chunking steps
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentStep('📄 Extracting text from all documents...');
        setChunkingProgress(50);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentStep('✂️ Creating intelligent chunks...');
        setChunkingProgress(75);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentStep('🔍 Indexing combined content...');
        setChunkingProgress(90);
        
        await new Promise(resolve => setTimeout(resolve, 600));
        setCurrentStep('✅ All documents processed!');
        setChunkingProgress(100);
        
        setFileHash(data.combined_hash);
        setProcessingStats({
          filesProcessed: data.files_processed,
          totalChunks: data.total_chunks,
          processingTime: data.processing_time,
          totalTextLength: data.total_text_length,
          filesCount: fileArray.length
        });
        setIsPdfReady(true);
        
        // Show success animation briefly
        setIsChunking(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        
        // Update UI with success message
        const textarea = document.getElementById('response') as HTMLTextAreaElement;
        if (textarea) {
          const filesList = fileArray.map(f => f.name).join(', ');
          textarea.value = `✅ ${fileArray.length} documents processed successfully!\n\nFiles: ${filesList}\nTotal Text Length: ${data.total_text_length} characters\nTotal Chunks: ${data.total_chunks}\nProcessing Time: ${data.processing_time}s\n\nReady to answer questions across all documents!`;
        }
      } else {
        throw new Error(data.error || 'Failed to process documents');
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      
      // Enhanced error handling for legal document validation
      const errorMessage = String(error);
      if (errorMessage.includes('does not appear to be a legal document')) {
        const errorDetails = `⚠️ LEGAL DOCUMENT VALIDATION FAILED\n\n${errorMessage}\n\nPlease ensure all uploaded files are legal documents such as:\n• Contracts and Agreements\n• Legal Briefs and Motions\n• Statutes and Regulations\n• Court Documents\n• Legal Opinions\n• Terms of Service\n• Privacy Policies\n• And other legal texts`;
        
        const textarea = document.getElementById('response') as HTMLTextAreaElement;
        if (textarea) {
          textarea.value = errorDetails;
        }
        alert('⚠️ Please upload only legal documents for analysis');
      } else {
        alert('Error processing documents: ' + error);
      }
      
      setIsPdfReady(false);
      setCurrentStep('❌ Processing failed');
    } finally {
      setIsUploading(false);
      setIsChunking(false);
      // Keep processing true briefly to show success state
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep('');
        setChunkingProgress(0);
      }, showSuccess ? 2000 : 0);
    }
  };

  const askQuestionWithCache = async (question: string) => {
    if (!fileHash) {
      alert('Please upload a document first.');
      return;
    }
    
    setIsAsking(true);
    
    try {
      console.log('Asking question with cached data...');
      
      const response = await fetch('http://127.0.0.1:5000/ask-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_hash: fileHash,
          question: question
        }),
      });
      
      const data = await response.json();
      console.log('Question response:', data);
      
      if (data.success && data.answers) {
        const textareaContent = data.answers
          .map((res: any, index: number) => {
            let responseText = `Answer ${index + 1}: ${res.answer}`;
            
            // Add probability if it exists and is not undefined
            if (res.probability && res.probability !== undefined) {
              responseText += ` (Confidence: ${res.probability})`;
            }
            
            // Add analysis if it exists and is not undefined
            if (res.analyse && res.analyse !== undefined) {
              responseText += ` (Analysis: ${res.analyse})`;
            }
            
            return responseText;
          })
          .join('\n');

        const textarea = document.getElementById('response') as HTMLTextAreaElement;
        if (textarea) {
          textarea.value = textareaContent;
        }
        
        if (data.answers.length > 0) {
          setSelectedResponse(data.answers[0].answer);
        }
      } else {
        throw new Error(data.error || 'Failed to get answer');
      }
    } catch (error) {
      console.error('Error asking question:', error);
      alert('Error asking question: ' + error);
    } finally {
      setIsAsking(false);
    }
  };
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const filesInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Step 1: Handle file upload if not already processed
    if (filesInput && filesInput.files && filesInput.files.length > 0 && !isPdfReady) {
      if (filesInput.files.length === 1) {
        await handleFileUpload(filesInput.files[0]);
      } else {
        await handleMultipleFileUpload(filesInput.files);
      }
      return; // Wait for file processing to complete
    }
    
    // Step 2: Handle question asking
    if (isPdfReady && fileHash) {
      // Use custom question if in custom mode, otherwise use predefined question
      const questionToSend = questionMode === 'custom' ? customQuestion.trim() : selectedQuestion;
      
      // Validation
      if (!questionToSend) {
        alert('Please select a predefined question or enter a custom question.');
        return;
      }
      
      if (questionMode === 'custom' && customQuestion.trim().length < 5) {
        alert('Please enter a meaningful question (at least 5 characters).');
        return;
      }
      
      await askQuestionWithCache(questionToSend);
    } else if (!filesInput || !filesInput.files || filesInput.files.length === 0) {
      alert('Please select one or more files to upload.');
    }
  };

  const handleAskAnotherQuestion = async () => {
    if (!isPdfReady || !fileHash) {
      alert('Please upload and process a document first.');
      return;
    }
    
    const questionToSend = questionMode === 'custom' ? customQuestion.trim() : selectedQuestion;
    
    if (!questionToSend) {
      alert('Please select a predefined question or enter a custom question.');
      return;
    }
    
    if (questionMode === 'custom' && customQuestion.trim().length < 5) {
      alert('Please enter a meaningful question (at least 5 characters).');
      return;
    }
    
    await askQuestionWithCache(questionToSend);
  };
  
  
  
  // Enhanced chunking animation component
  const ChunkingAnimation = ({ message, isChunking, isComplete }: { message: string, isChunking: boolean, isComplete?: boolean }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexDirection: 'column',
      padding: '30px',
      color: '#00ff41',
      background: 'rgba(0, 255, 65, 0.03)',
      borderRadius: '15px',
      border: '1px solid rgba(0, 255, 65, 0.3)',
      margin: '20px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background pulse effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, transparent, rgba(0, 255, 65, 0.1), transparent)',
        animation: isChunking ? 'pulse-bg 2s ease-in-out infinite' : 'none',
        zIndex: 0
      }}></div>

      {/* Document icon with chunks */}
      <div style={{ 
        position: 'relative',
        marginBottom: '20px',
        zIndex: 1
      }}>
        <div style={{
          width: '60px',
          height: '80px',
          background: 'rgba(0, 255, 65, 0.1)',
          border: '2px solid #00ff41',
          borderRadius: '8px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Document lines that split into chunks */}
          {[1, 2, 3, 4].map((line, index) => (
            <div
              key={line}
              style={{
                width: '40px',
                height: '4px',
                background: '#00ff41',
                margin: '3px',
                borderRadius: '2px',
                animation: isChunking ? `chunk-split-${index + 1} 3s ease-in-out infinite` : 'none',
                transformOrigin: 'left center'
              }}
            />
          ))}
        </div>

        {/* Floating chunk particles */}
        {isChunking && [1, 2, 3, 4, 5].map((particle) => (
          <div
            key={particle}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              background: '#00ff41',
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              animation: `float-particle-${particle} 2s ease-in-out infinite`,
              animationDelay: `${particle * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        width: '300px',
        height: '12px',
        background: 'rgba(0, 255, 65, 0.2)',
        borderRadius: '6px',
        marginBottom: '15px',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(0, 255, 65, 0.3)'
      }}>
        <div style={{
          height: '100%',
          width: chunkingProgress > 0 ? `${chunkingProgress}%` : '0%',
          background: 'linear-gradient(90deg, #00ff41, #00cc33, #00ff41)',
          borderRadius: '5px',
          transition: 'width 0.5s ease-in-out',
          backgroundSize: '200% 100%',
          animation: isChunking ? 'progress-shimmer 2s ease-in-out infinite' : 'none'
        }}></div>
        
        {/* Progress percentage */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#00ff41',
          textShadow: '0 0 3px rgba(0, 0, 0, 0.8)'
        }}>
          {chunkingProgress}%
        </div>
      </div>

      {/* Message */}
      <p style={{ 
        margin: 0, 
        fontSize: '16px', 
        fontWeight: '500',
        zIndex: 1,
        animation: isChunking ? 'text-glow 2s ease-in-out infinite' : 'none'
      }}>
        {currentStep || message}
      </p>

      {/* Chunk counter animation */}
      {isChunking && (
        <div style={{
          marginTop: '10px',
          fontSize: '12px',
          opacity: 0.8,
          zIndex: 1,
          animation: 'count-up 1s ease-in-out infinite'
        }}>
          📄 Creating intelligent chunks...
        </div>
      )}

      {/* Success state */}
      {isComplete && (
        <div style={{
          marginTop: '10px',
          fontSize: '14px',
          color: '#00ff41',
          zIndex: 1,
          animation: 'success-pop 0.6s ease-out'
        }}>
          ✅ Document ready for analysis!
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-bg {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        @keyframes chunk-split-1 {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(-15px) scale(0.8); }
        }

        @keyframes chunk-split-2 {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(15px) scale(0.8); }
        }

        @keyframes chunk-split-3 {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(-10px) scale(0.9); }
        }

        @keyframes chunk-split-4 {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(10px) scale(0.9); }
        }

        @keyframes float-particle-1 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(0); }
          50% { transform: translate(-50%, -50%) translateY(-30px) translateX(-20px) scale(1); }
        }

        @keyframes float-particle-2 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(0); }
          50% { transform: translate(-50%, -50%) translateY(-35px) translateX(25px) scale(1); }
        }

        @keyframes float-particle-3 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(0); }
          50% { transform: translate(-50%, -50%) translateY(-25px) translateX(-30px) scale(1); }
        }

        @keyframes float-particle-4 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(0); }
          50% { transform: translate(-50%, -50%) translateY(-40px) translateX(15px) scale(1); }
        }

        @keyframes float-particle-5 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(0); }
          50% { transform: translate(-50%, -50%) translateY(-30px) translateX(-5px) scale(1); }
        }

        @keyframes progress-fill {
          0% { width: 0%; background-position: 0% 50%; }
          50% { width: 70%; background-position: 100% 50%; }
          100% { width: 100%; background-position: 0% 50%; }
        }

        @keyframes progress-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 5px rgba(0, 255, 65, 0.5); }
          50% { text-shadow: 0 0 20px rgba(0, 255, 65, 0.8); }
        }

        @keyframes count-up {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes success-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );

  // Status indicator component
  const StatusIndicator = () => (
    <div style={{ 
      padding: '10px', 
      marginBottom: '15px', 
      borderRadius: '5px',
      backgroundColor: isPdfReady ? '#d4edda' : '#f8d7da',
      border: `1px solid ${isPdfReady ? '#c3e6cb' : '#f5c6cb'}`,
      color: isPdfReady ? '#155724' : '#721c24'
    }}>
      {isPdfReady ? (
        <div>
          ✅ <strong>Document{uploadedFiles.length > 1 ? 's' : ''} Ready</strong>
          {uploadedFiles.length > 1 ? (
            <div style={{ marginTop: '5px' }}>
              <strong>{uploadedFiles.length} files:</strong> {uploadedFiles.join(', ')}
            </div>
          ) : (
            <span> {uploadedFileName}</span>
          )}
          {processingStats && (
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              {processingStats.filesCount ? (
                <>Files: {processingStats.filesCount} | Total Chunks: {processingStats.totalChunks} | Processed in {processingStats.processingTime}s</>
              ) : (
                <>Chunks: {processingStats.chunksCount} | {processingStats.cached ? ' Loaded from cache' : ` Processed in ${processingStats.processingTime}s`}</>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>📄 Upload one or more documents to get started</div>
      )}
    </div>
  );

  // Removed authentication check - page is now public
  return (
    <>
      <Head>
        <title>DocuLix Dashboard - AI Legal Document Analysis</title>
        <meta name="description" content="Upload and analyze legal documents with DocuLix's AI-powered platform. Get instant answers to your legal questions." />
      </Head>
      <div className="dashboard-page">
      <div 
        id="dashboard-custom-navbar" 
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          width: '100vw',
          height: 'auto',
          zIndex: '99999',
          background: 'none',
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          padding: '18px 0',
          margin: '0',
          border: 'none',
          boxShadow: 'none',
          transition: 'none'
        }}
      >
        <div 
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 15px',
            background: 'none',
            backgroundColor: 'transparent',
            backgroundImage: 'none'
          }}
        >
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              background: 'none',
              backgroundColor: 'transparent'
            }}
          >
              {/* Brand Section */}
              <a href="/" className="d-flex align-items-center text-decoration-none" style={{marginRight: '30px'}}>
                <img 
                  className="me-2" 
                  src="/assets/img/logo.jpg" 
                  alt="DocuLix Logo" 
                  style={{height: '40px', width: 'auto'}} 
                />
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                  <div 
                    className="doculix-hover" 
                    style={{
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: '#fff', 
                      transition: 'color 0.3s ease', 
                      lineHeight: '1.2'
                    }}
                  >
                    DocuLix
                  </div>
                  <div 
                    style={{
                      fontSize: '0.9rem', 
                      color: '#fff', 
                      lineHeight: '1', 
                      marginTop: '2px'
                    }}
                  >
                    Turning legal jargon into plain language
                  </div>
                </div>
              </a>

              {/* Navigation Links */}
              <div className="d-flex align-items-center">
                <a
                  href="/"
                  className="text-decoration-none"
                  style={{
                    marginRight: '20px',
                    color: '#fff',
                    fontSize: '18px',
                    opacity: activeLink === "home" ? 1 : 0.75,
                    transition: 'color 0.3s ease, opacity 0.3s ease'
                  }}
                  onClick={() => onUpdateActiveLink("home")}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = '#FFD700';
                    (e.target as HTMLElement).style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = '#fff';
                    (e.target as HTMLElement).style.opacity = activeLink === "home" ? '1' : '0.75';
                  }}
                >
                  Home
                </a>

                <a
                  href="/signout"
                  className="text-decoration-none"
                  style={{
                    marginRight: '10px',
                    color: '#fff',
                    fontSize: '18px',
                    opacity: '0.75',
                    transition: 'color 0.3s ease, opacity 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = '#FFD700';
                    (e.target as HTMLElement).style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = '#fff';
                    (e.target as HTMLElement).style.opacity = '0.75';
                  }}
                >
                  Sign Out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='dashboard' style={{marginTop: '90px'}}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h1 
            className="doculix-dashboard-hover"
            style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              marginBottom: '20px',
              background: 'linear-gradient(90.21deg, #B8860B -5.91%, #DAA520 50%, #FFD700 111.58%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: '#B8860B',
              textAlign: 'center',
              zIndex: 10,
              position: 'relative',
              textShadow: '0 0 15px rgba(184, 134, 11, 0.5), 0 0 30px rgba(255, 215, 0, 0.3)'
            }}
          >
            DocuLix Dashboard
          </h1>
          <div className="typewriter-container" style={{textAlign: 'center', zIndex: 10, position: 'relative'}}>
            <span className="typewriter" style={{
              fontSize: '1.5rem', 
              color: '#aaa',
              fontFamily: 'monospace'
            }}>
              Turning legal jargon into plain language
            </span>
          </div>
        </div>

        <StatusIndicator />
        
        {/* PDF Upload Section - Now at the top */}
        <form onSubmit={handleFormSubmit} encType="multipart/form-data">
          {!isPdfReady && (
            <div style={{ 
              marginBottom: '40px', 
              padding: '20px', 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                color: 'white', 
                marginBottom: '20px', 
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: '600'
              }}>📤 Upload & Process Documents</h3>
              <label htmlFor="images" className="drop-container">
                <span className="drop-title">Drop multiple files here (PDF, Word, Images)</span>
                <div style={{fontSize: '14px', color: '#FFD700', opacity: 0.8, marginTop: '5px'}}>
                  Select multiple files: PDF, DOC, DOCX, TXT, JPG, PNG, JPEG, GIF, BMP, TIFF
                </div>
                or
                <input 
                  type="file" 
                  className='file-upload' 
                  name="files" 
                  accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.tiff" 
                  multiple
                  required 
                  disabled={isProcessing}
                />
              </label>
            </div>
          )}
          
          {isPdfReady && (
            <div style={{ 
              padding: '15px', 
              marginBottom: '25px', 
              backgroundColor: '#e7f3ff', 
              borderRadius: '5px',
              border: '1px solid #b3d9ff',
              color: '#0066cc'
            }}>
              <strong>📄 Document{uploadedFiles.length > 1 ? 's' : ''} Loaded:</strong>
              {uploadedFiles.length > 1 ? (
                <div style={{ marginTop: '5px' }}>
                  {uploadedFiles.map((fileName, index) => (
                    <div key={index} style={{ fontSize: '14px' }}>• {fileName}</div>
                  ))}
                </div>
              ) : (
                <span> {uploadedFileName}</span>
              )}
              <br />
              <small>You can now ask questions about {uploadedFiles.length > 1 ? 'these documents' : 'this document'}</small>
            </div>
          )}
        
        {/* Chunk Extraction Animation */}
        {isProcessing && (
          <ChunkingAnimation 
            message={
              isUploading ? "🚀 Uploading document..." : 
              isChunking ? "🧠 Analyzing and chunking document..." :
              showSuccess ? "✅ Document processed successfully!" :
              "⚡ Finalizing processing..."
            } 
            isChunking={isChunking}
            isComplete={showSuccess}
          />
        )}
        
        {/* Question Section - Only show after successful document processing */}
        {isPdfReady && (
          <div className={styles.questionSection}>
            <h3 style={{color: 'white', marginBottom: '10px'}}>Choose a Question:</h3>
          
          {/* Step 1: Select question mode */}
          <select 
            className="select-box" 
            value={questionMode} 
            onChange={handleQuestionModeSelect}
            style={{marginBottom: '15px'}}
          >
            <option value="">Choose an option...</option>
            <option value="predefined">📋 Select a predefined question</option>
            <option value="custom">📝 Ask your own question</option>
          </select>

          {/* Step 2: Show predefined questions if selected */}
          {questionMode === 'predefined' && (
            <div className={styles.customQuestionContainer}>
              <label style={{color: 'white', display: 'block', marginBottom: '5px'}}>
                Select from predefined questions:
              </label>
              <select 
                name="question" 
                className="select-box" 
                value={selectedQuestion} 
                onChange={handlePredefinedQuestionSelect}
                required
              >
                <option value="">Choose a question...</option>
                {questions && questions.map((question, index) => (
                  <option key={index} value={question}>
                    {question}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 2: Show custom question input if selected */}
          {questionMode === 'custom' && (
            <div className={styles.customQuestionContainer}>
              <label htmlFor="customQuestion" style={{color: 'white', display: 'block', marginBottom: '5px'}}>
                Enter your custom question:
              </label>
              <input
                type="text"
                id="customQuestion"
                className={styles.customQuestionInput}
                value={customQuestion}
                onChange={handleCustomQuestionChange}
                placeholder="Type your question here..."
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid transparent',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  fontSize: '14px'
                }}
              />
            </div>
          )}
        </div>
        )}
        
        {isAsking && (
          <ChunkingAnimation 
            message="🤖 Getting AI response..." 
            isChunking={true} 
          />
        )}
        
        {!isPdfReady ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <input 
              className="custom-btn btn-8" 
              type="submit" 
              value="Upload & Process Document" 
              disabled={isProcessing}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
            <input 
              className="custom-btn btn-8" 
              type="button"
              value="Ask Question" 
              onClick={handleAskAnotherQuestion}
              disabled={isAsking}
            />
            <input 
              className="custom-btn btn-8" 
              type="button"
              value="Upload New Document" 
              onClick={() => {
                setIsPdfReady(false);
                setFileHash('');
                setUploadedFileName('');
                setUploadedFiles([]);
                setProcessingStats(null);
                setSelectedResponse('');
                const textarea = document.getElementById('response') as HTMLTextAreaElement;
                if (textarea) textarea.value = '';
              }}
            />
          </div>
        )}
      </form>
      {/* <div id="response"></div> */}
      <div className="code-container">
                
                <section className="augs bg" data-augmented-ui>
                <input className="title" value="Get Response"/>
                    <div className="code highcontrast-dark">
                        
                            <textarea id="response" className="code-textarea" rows={10}   placeholder="Generate Response..." readOnly>

                            </textarea> 
                    </div>
                    
                    
                    
                </section>
        </div>
      

      {/* Footer Section */}
      <footer style={{
        marginTop: '60px',
        padding: '40px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        color: '#fff'
      }}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          {/* Team Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            fontSize: '16px'
          }}>
            <span style={{marginRight: '8px'}}>👥</span>
            <span>Designed and Developed by Team DocuLix</span>
          </div>
          
          {/* Contact Info */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '30px'
          }}>
            {/* Email */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#aaa'
            }}>
              <span style={{marginRight: '8px', fontSize: '16px'}}>📧</span>
              <a 
                href="mailto:doculix92@gmail.com" 
                className="footer-link"
                style={{
                  color: '#FFD700',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
              >
                doculix92@gmail.com
              </a>
            </div>
            
            {/* Phone */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#aaa'
            }}>
              <span style={{marginRight: '8px', fontSize: '16px'}}>📞</span>
              <a 
                href="tel:8210016623" 
                className="footer-link"
                style={{
                  color: '#FFD700',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
              >
                +91 8210016623
              </a>
            </div>
          </div>
          
          {/* Copyright */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
            fontSize: '12px',
            color: '#777',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{marginRight: '8px'}}>©</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
    {/* Removed RealTimeTranslator and target language UI as requested */}
    </>
  );
};

export default FileUpload;
