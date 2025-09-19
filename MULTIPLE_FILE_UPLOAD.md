# DocuLix - Multiple File Upload Feature

## Overview
DocuLix now supports uploading and processing multiple documents simultaneously for comprehensive legal document analysis.

## Supported File Types
- **PDF Files**: `.pdf`
- **Word Documents**: `.doc`, `.docx` 
- **Images with Text**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.tiff`
- **Text Files**: `.txt`

## New Features

### Multiple File Upload
- Select multiple files at once using Ctrl+Click or Shift+Click
- Drag and drop multiple files into the upload area
- Combined processing of all uploaded documents
- Unified question-answering across all documents

### Enhanced Processing
- **Combined Text Analysis**: All documents are merged with clear separators
- **Intelligent Chunking**: Creates optimal chunks across all documents
- **Cross-Document Search**: Ask questions that span multiple documents
- **Performance Optimized**: Efficient processing with caching support

### User Interface Improvements
- **Multi-File Status Display**: Shows all uploaded file names
- **Enhanced Progress Tracking**: Processing status for multiple files
- **Combined Results**: Single interface for querying all documents

## Usage Instructions

### 1. Upload Multiple Files
1. Click "Choose Files" and select multiple documents
2. Or drag and drop multiple files into the upload area
3. Click "Upload & Process Documents"

### 2. Processing
- The system will extract text from all files
- Files are combined with document separators
- Progress is shown for the entire batch
- Processing time scales with total content

### 3. Questioning
- Ask questions about any document in the set
- Questions can reference information across multiple documents
- Same predefined and custom question options available

## Technical Implementation

### Frontend Changes
- Updated file input to support `multiple` attribute
- Enhanced state management for file arrays
- Improved status indicators for multiple files
- Better error handling and user feedback

### Backend Changes
- New `/upload-multiple` endpoint
- Combined text processing with document separators
- Enhanced caching for multiple file sets
- Optimized chunking for larger combined content

### File Processing Flow
1. **Individual Processing**: Each file is processed based on its type
2. **Text Combination**: All extracted text is combined with separators
3. **Unified Chunking**: Combined content is chunked intelligently
4. **Caching**: Results are cached for quick access
5. **Query Processing**: Questions search across all combined content

## Performance Considerations

### Optimization Features
- **Smart Caching**: Identical file combinations are cached
- **Chunking Limits**: Large document sets use fast-mode processing
- **Memory Management**: Efficient processing of multiple files
- **Error Recovery**: Individual file failures don't stop batch processing

### Recommended Usage
- **Small Sets (1-5 files)**: Full processing with pre-simplification
- **Large Sets (6+ files)**: Fast mode with original chunk processing
- **Mixed Types**: Combine PDFs, Word docs, and images seamlessly

## Error Handling

### File-Level Errors
- Individual file extraction failures are logged
- Processing continues with successfully extracted files
- Clear error messages for unsupported files

### Batch-Level Errors
- Network errors during upload
- Processing failures
- Memory or timeout issues

## Future Enhancements

### Planned Features
- **Individual File Management**: Remove specific files from batch
- **Advanced Filtering**: Filter results by source document
- **Document Comparison**: Compare information across documents
- **Batch Export**: Export combined analysis results

### Performance Improvements
- **Parallel Processing**: Process multiple files simultaneously
- **Streaming Upload**: Upload files as they're selected
- **Progressive Loading**: Show results as files are processed

## Migration Notes

### Existing Functionality
- Single file upload still works exactly as before
- All existing features remain unchanged
- Backward compatibility maintained

### New API Endpoints
- `/upload-multiple` - For multiple file processing
- Original `/upload-pdf` - Still handles single files

## Support

For issues with multiple file upload:
1. Check file formats are supported
2. Verify total file size is reasonable
3. Ensure stable internet connection
4. Contact team if processing fails

---

**DocuLix Team**  
📧 doculix92@gmail.com  
📞 +91 8210016623