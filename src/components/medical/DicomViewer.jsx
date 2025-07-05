import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Hammer from 'hammerjs';

import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

// Attach Hammer to window for cornerstone-tools
if (typeof window !== 'undefined') {
  window.Hammer = Hammer;
}

// Set external dependencies for cornerstone tools and wado image loader
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

// Initialize web worker for cornerstone-wado-image-loader
cornerstoneWADOImageLoader.webWorkerManager.initialize({
  webWorkerPath: '/cornerstoneWADOImageLoaderWebWorker.js',
  taskConfiguration: {
    decodeTask: {
      codecsPath: '/cornerstoneWADOImageLoaderCodecs.js',
    },
  },
});

// Constants
const TOOL_LIST = [
  { name: 'Wwwc', label: 'Window/Level', icon: '🌗' },
  { name: 'Pan', label: 'Pan', icon: '✋' },
  { name: 'Zoom', label: 'Zoom', icon: '🔍' },
  { name: 'StackScrollMouseWheel', label: 'Scroll', icon: '🖱️' },
];

const ZOOM_FACTOR = 1.2;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;

// Custom hook for cornerstone initialization and management
function useCornerstone(imageUrls, currentIndex, activeTool) {
  const elementRef = useRef(null);
  const [numImages, setNumImages] = useState(0);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Helper to get imageIds in wadouri format
  const getImageIds = useCallback(() => (
    imageUrls.map((url) => (url.startsWith('wadouri:') ? url : `wadouri:${url}`))
  ), [imageUrls]);

  // Handle tool activation
  const activateTool = useCallback(
    (toolName) => {
      if (!elementRef.current) return;
      TOOL_LIST.forEach((tool) => {
        try {
          if (!cornerstoneTools.getToolForElement(elementRef.current, tool.name)) {
            const ToolClass = cornerstoneTools[tool.name + 'Tool'];
            if (ToolClass) cornerstoneTools.addTool(ToolClass);
          }
          if (tool.name === toolName) {
            const config = tool.name === 'StackScrollMouseWheel'
              ? {}
              : { mouseButtonMask: tool.name === 'Wwwc' ? 1 : tool.name === 'Pan' ? 4 : 2 };
            cornerstoneTools.setToolActive(tool.name, config);
          } else {
            cornerstoneTools.setToolDisabled(tool.name, {});
          }
        } catch (e) {
          // ignore
        }
      });
    },
    []
  );

  // Handle image navigation
  const goToImage = useCallback(
    (idx) => {
      if (!elementRef.current) return;
      const imageIds = getImageIds();
      if (idx < 0 || idx >= imageIds.length) return;
      setError(null);
      cornerstone
        .loadImage(imageIds[idx])
        .then((image) => {
          cornerstone.displayImage(elementRef.current, image);
        })
        .catch((err) => {
          setError('Failed to load DICOM image. Please check the file or try again.');
          console.error('Error loading DICOM image:', err);
        });
    },
    [getImageIds]
  );

  // Zoom controls
  const handleZoom = useCallback((factor) => {
    if (!elementRef.current) return;
    const viewport = cornerstone.getViewport(elementRef.current);
    viewport.scale = Math.max(MIN_ZOOM, Math.min(viewport.scale * factor, MAX_ZOOM));
    setZoomLevel(viewport.scale);
    cornerstone.setViewport(elementRef.current, viewport);
  }, []);

  const handleResetZoom = useCallback(() => {
    if (!elementRef.current) return;
    const viewport = cornerstone.getViewport(elementRef.current);
    viewport.scale = 1;
    setZoomLevel(1);
    cornerstone.setViewport(elementRef.current, viewport);
  }, []);

  // Main cornerstone setup
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !imageUrls.length) return;

    cornerstone.enable(element);

    const imageIds = getImageIds();
    setNumImages(imageIds.length);

    // Prepare stack
    const stack = {
      currentImageIdIndex: currentIndex,
      imageIds,
    };

    let toolCleanup = () => {};

    setError(null);

    cornerstone
      .loadImage(imageIds[currentIndex])
      .then((image) => {
        cornerstone.displayImage(element, image);
        setZoomLevel(1);

        // Initialize cornerstoneTools only once
        if (!cornerstoneTools.store || !cornerstoneTools.store.state) {
          cornerstoneTools.init();
        }

        // Add stack state manager and tool state
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);

        // Add and activate tools
        TOOL_LIST.forEach((tool) => {
          if (!cornerstoneTools.getToolForElement(element, tool.name)) {
            const ToolClass = cornerstoneTools[tool.name + 'Tool'];
            if (ToolClass) cornerstoneTools.addTool(ToolClass);
          }
        });

        activateTool(activeTool);

        // Clean up function for tools
        toolCleanup = () => {
          try {
            TOOL_LIST.forEach((tool) => {
              cornerstoneTools.setToolDisabled(tool.name, {});
            });
          } catch (e) {
            // ignore
          }
        };
      })
      .catch((err) => {
        setError('Failed to load DICOM image. Please check the file or try again.');
        console.error('Error loading DICOM image:', err);
      });

    // Clean up on unmount
    return () => {
      toolCleanup();
      try {
        cornerstone.disable(element);
      } catch (e) {
        // ignore
      }
    };
  }, [imageUrls, currentIndex, activeTool, activateTool, getImageIds]);

  return {
    elementRef,
    numImages,
    error,
    zoomLevel,
    activateTool,
    goToImage,
    handleZoom,
    handleResetZoom,
  };
}

// Custom hook for fullscreen management
function useFullscreen() {
  const [fullView, setFullView] = useState(false);
  const fullScreenRef = useRef(null);

  useEffect(() => {
    const exitHandler = () => {
      if (!document.fullscreenElement) {
        setFullView(false);
      }
    };
    document.addEventListener('fullscreenchange', exitHandler);
    return () => document.removeEventListener('fullscreenchange', exitHandler);
  }, []);

  const handleFullScreenToggle = useCallback(() => {
    if (!fullView) {
      const el = fullScreenRef.current;
      if (el && el.requestFullscreen) {
        el.requestFullscreen().catch((err) => {
          console.error('Fullscreen request denied', err);
        });
      }
      setFullView(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setFullView(false);
    }
  }, [fullView]);

  return { fullView, fullScreenRef, handleFullScreenToggle };
}

// Custom hook for keyboard navigation
function useKeyboardNavigation(currentIndex, numImages, goToImage, toggleFullView) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!numImages) return;
      switch (e.key) {
        case 'ArrowLeft':
          goToImage(Math.max(currentIndex - 1, 0));
          break;
        case 'ArrowRight':
          goToImage(Math.min(currentIndex + 1, numImages - 1));
          break;
        case 'f':
        case 'F':
          toggleFullView();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, numImages, goToImage, toggleFullView]);
}

// Toolbar Button Component
const ToolbarButton = React.memo(function ToolbarButton({
  onClick,
  title,
  children,
  isActive = false,
  disabled = false,
  style = {},
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        background: isActive ? '#1976d2' : 'transparent',
        color: isActive ? '#fff' : '#bbb',
        border: 'none',
        borderRadius: 4,
        padding: '2px 10px',
        marginRight: 2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: isActive ? 600 : 400,
        fontSize: 15,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      type="button"
    >
      {children}
    </button>
  );
});

// Zoom Controls Component
const ZoomControls = React.memo(function ZoomControls({ onZoomIn, onZoomOut, onReset }) {
  return (
    <>
      <ToolbarButton
        onClick={onZoomIn}
        title="Zoom In"
        style={{ marginLeft: 8, fontSize: 18, padding: '2px 6px' }}
      >
        ➕
      </ToolbarButton>
      <ToolbarButton
        onClick={onZoomOut}
        title="Zoom Out"
        style={{ fontSize: 18, padding: '2px 6px' }}
      >
        ➖
      </ToolbarButton>
      <ToolbarButton
        onClick={onReset}
        title="Reset Zoom"
        style={{ fontSize: 18, padding: '2px 6px' }}
      >
        🔄
      </ToolbarButton>
    </>
  );
});

// Image Navigation Component
const ImageNavigation = React.memo(function ImageNavigation({ currentIndex, numImages, onPrevious, onNext }) {
  if (numImages <= 1) return null;
  return (
    <span style={{ color: '#bbb', fontSize: 13, marginLeft: 8 }}>
      <ToolbarButton
        onClick={onPrevious}
        title="Previous Image (←)"
        disabled={currentIndex === 0}
        style={{ fontSize: 16, padding: '2px 4px' }}
      >
        ◀
      </ToolbarButton>
      <span style={{ minWidth: 40, display: 'inline-block', textAlign: 'center' }}>
        {currentIndex + 1} / {numImages}
      </span>
      <ToolbarButton
        onClick={onNext}
        title="Next Image (→)"
        disabled={currentIndex === numImages - 1}
        style={{ fontSize: 16, padding: '2px 4px' }}
      >
        ▶
      </ToolbarButton>
    </span>
  );
});

// Floating Toolbar Component
const FloatingToolbar = React.memo(function FloatingToolbar({
  fullView,
  activeTool,
  currentIndex,
  numImages,
  onFullScreenToggle,
  onToolActivate,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onPreviousImage,
  onNextImage,
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        gap: 10,
        background: 'rgba(30,30,30,0.85)',
        borderRadius: 8,
        padding: '6px 16px',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      }}
    >
      <ToolbarButton
        onClick={onFullScreenToggle}
        title={fullView ? 'Exit Full View (F)' : 'Full View (F)'}
        style={{ fontSize: 20, marginRight: 8, padding: '2px 6px' }}
      >
        {fullView ? '🗗' : '🗖'}
      </ToolbarButton>
      {TOOL_LIST.map((tool) => (
        <ToolbarButton
          key={tool.name}
          onClick={() => onToolActivate(tool.name)}
          isActive={activeTool === tool.name}
          title={tool.label}
        >
          <span>{tool.icon}</span> {tool.label}
        </ToolbarButton>
      ))}
      <ZoomControls
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onReset={onResetZoom}
      />
      <ImageNavigation
        currentIndex={currentIndex}
        numImages={numImages}
        onPrevious={onPreviousImage}
        onNext={onNextImage}
      />
    </div>
  );
});

// Instructions Overlay Component
const InstructionsOverlay = React.memo(function InstructionsOverlay({ error }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: error ? 40 : 10,
        left: 0,
        width: '100%',
        textAlign: 'center',
        color: '#bbb',
        fontSize: 13,
        pointerEvents: 'none',
        zIndex: 10,
        textShadow: '0 1px 2px #000',
      }}
    >
      <span>
        Mouse: Left=Window/Level, Middle=Zoom, Right=Pan. Scroll=Slice. <br />
        Keyboard: ←/→ = Prev/Next, F = Full View
      </span>
    </div>
  );
});

// Spinner Component
const Spinner = React.memo(function Spinner() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 100,
      pointerEvents: 'none',
    }}>
      <div style={{
        width: 48,
        height: 48,
        border: '5px solid #eee',
        borderTop: '5px solid #1976d2',
        borderRadius: '50%',
        animation: 'dicom-spin 1s linear infinite',
      }} />
      <style>{`
        @keyframes dicom-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

// Metadata Overlay
const MetadataOverlay = React.memo(function MetadataOverlay({ metadata }) {
  if (!metadata) return null;
  return (
    <div style={{
      position: 'absolute',
      top: 16,
      right: 16,
      background: 'rgba(24,24,24,0.85)',
      color: '#fff',
      borderRadius: 8,
      padding: '10px 18px',
      fontSize: 13,
      zIndex: 30,
      boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      minWidth: 120,
      maxWidth: 220,
      pointerEvents: 'none',
      lineHeight: 1.6,
    }}>
      <div><b>Modality:</b> {metadata.modality || 'N/A'}</div>
      <div><b>Size:</b> {metadata.rows} x {metadata.columns}</div>
      <div><b>Slice:</b> {metadata.slice || 'N/A'}</div>
      <div><b>Window:</b> {metadata.windowWidth} / {metadata.windowCenter}</div>
    </div>
  );
});

// Enhanced Error Message
const ErrorMessage = React.memo(function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        minWidth: 220,
        maxWidth: 400,
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 600,
        background: 'linear-gradient(90deg, #d32f2f 0%, #b71c1c 100%)',
        padding: '14px 24px',
        zIndex: 30,
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        pointerEvents: 'none',
        textShadow: '0 1px 2px #000',
      }}
    >
      {error}
    </div>
  );
});

// Main DicomViewer Component
function DicomViewer({ imageUrls = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTool, setActiveTool] = useState('Wwwc');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);

  const {
    elementRef,
    numImages,
    error,
    zoomLevel,
    activateTool,
    goToImage,
    handleZoom,
    handleResetZoom,
  } = useCornerstone(imageUrls, currentIndex, activeTool);

  const { fullView, fullScreenRef, handleFullScreenToggle } = useFullscreen();

  // Navigation handlers
  const handlePreviousImage = useCallback(() => {
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    goToImage(newIndex);
  }, [currentIndex, goToImage]);

  const handleNextImage = useCallback(() => {
    const newIndex = Math.min(currentIndex + 1, numImages - 1);
    setCurrentIndex(newIndex);
    goToImage(newIndex);
  }, [currentIndex, numImages, goToImage]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => handleZoom(ZOOM_FACTOR), [handleZoom]);
  const handleZoomOut = useCallback(() => handleZoom(1 / ZOOM_FACTOR), [handleZoom]);

  // Keyboard navigation
  useKeyboardNavigation(currentIndex, numImages, goToImage, handleFullScreenToggle);

  // Responsive container styles
  const containerStyles = useMemo(() => ({
    position: 'relative',
    width: fullView ? '100vw' : 'min(98vw, 540px)',
    height: fullView ? '100vh' : 'min(80vh, 580px)',
    background: '#181818',
    margin: '0 auto',
    borderRadius: fullView ? 0 : 16,
    boxShadow: fullView ? '0 0 0 9999px rgba(0,0,0,0.7)' : '0 2px 16px rgba(0,0,0,0.18)',
    zIndex: fullView ? 1000 : 'auto',
    transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    outline: fullView ? '2px solid #1976d2' : 'none',
  }), [fullView]);

  const dicomElementStyles = useMemo(() => ({
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    outline: 'none',
    borderRadius: fullView ? 0 : 12,
    display: 'block',
    boxShadow: fullView ? 'none' : '0 2px 8px rgba(0,0,0,0.10)',
  }), [fullView]);

  // Loading and metadata extraction
  useEffect(() => {
    if (!elementRef.current || !imageUrls.length) return;
    setLoading(true);
    setMetadata(null);
    const imageIds = imageUrls.map((url) => url.startsWith('wadouri:') ? url : `wadouri:${url}`);
    cornerstone
      .loadImage(imageIds[currentIndex])
      .then((image) => {
        setLoading(false);
        // Extract metadata
        setMetadata({
          rows: image.rows,
          columns: image.columns,
          windowWidth: image.windowWidth,
          windowCenter: image.windowCenter,
          modality: image.data && image.data.string('x00080060'),
          slice: image.data && image.data.string('x00200013'),
        });
      })
      .catch(() => setLoading(false));
  }, [currentIndex, imageUrls, elementRef]);

  // Tool activation handler
  const handleToolActivate = useCallback((toolName) => {
    setActiveTool(toolName);
    activateTool(toolName);
  }, [activateTool]);

  return (
    <div ref={fullScreenRef} style={containerStyles} aria-label="DICOM Viewer" tabIndex={0}>
      <FloatingToolbar
        fullView={fullView}
        activeTool={activeTool}
        currentIndex={currentIndex}
        numImages={numImages}
        onFullScreenToggle={handleFullScreenToggle}
        onToolActivate={handleToolActivate}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onPreviousImage={handlePreviousImage}
        onNextImage={handleNextImage}
      />
      <MetadataOverlay metadata={metadata} />
      {loading && <Spinner />}
      <div
        ref={elementRef}
        style={dicomElementStyles}
        tabIndex={0}
        aria-label="DICOM Image Display"
      />
      <InstructionsOverlay error={error} />
      <ErrorMessage error={error} />
    </div>
  );
}

export default DicomViewer;
