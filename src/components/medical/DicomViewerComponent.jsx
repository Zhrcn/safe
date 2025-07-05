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
if (typeof window !== 'undefined') {
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    webWorkerPath: '/cornerstoneWADOImageLoaderWebWorker.js',
    taskConfiguration: {
      decodeTask: {
        codecsPath: '/cornerstoneWADOImageLoaderCodecs.js',
      },
    },
  });
}

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

function useFullscreen() {
  const [fullView, setFullView] = useState(false);
  const fullScreenRef = useRef(null);

  const handleFullScreenToggle = useCallback(() => {
    if (!fullScreenRef.current) return;

    if (!fullView) {
      if (fullScreenRef.current.requestFullscreen) {
        fullScreenRef.current.requestFullscreen();
      } else if (fullScreenRef.current.webkitRequestFullscreen) {
        fullScreenRef.current.webkitRequestFullscreen();
      } else if (fullScreenRef.current.msRequestFullscreen) {
        fullScreenRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }, [fullView]);

  useEffect(() => {
    const exitHandler = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        setFullView(false);
      }
    };

    const enterHandler = () => {
      setFullView(true);
    };

    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('msfullscreenchange', exitHandler);
    document.addEventListener('fullscreenerror', exitHandler);

    return () => {
      document.removeEventListener('fullscreenchange', exitHandler);
      document.removeEventListener('webkitfullscreenchange', exitHandler);
      document.removeEventListener('msfullscreenchange', exitHandler);
      document.removeEventListener('fullscreenerror', exitHandler);
    };
  }, []);

  return { fullView, fullScreenRef, handleFullScreenToggle };
}

function useKeyboardNavigation(currentIndex, numImages, goToImage, toggleFullView) {
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (currentIndex > 0) goToImage(currentIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (currentIndex < numImages - 1) goToImage(currentIndex + 1);
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullView();
        break;
      case 'Escape':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, numImages, goToImage, toggleFullView]);
}

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
      className={`p-2 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-blue-500 text-white shadow-lg'
          : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={style}
    >
      {children}
    </button>
  );
});

const ZoomControls = React.memo(function ZoomControls({ onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="flex items-center gap-1 bg-white/90 rounded-lg p-1 shadow-lg">
      <ToolbarButton onClick={onZoomOut} title="Zoom Out">
        🔍-
      </ToolbarButton>
      <ToolbarButton onClick={onReset} title="Reset Zoom">
        🔄
      </ToolbarButton>
      <ToolbarButton onClick={onZoomIn} title="Zoom In">
        🔍+
      </ToolbarButton>
    </div>
  );
});

const ImageNavigation = React.memo(function ImageNavigation({ currentIndex, numImages, onPrevious, onNext }) {
  return (
    <div className="flex items-center gap-2 bg-white/90 rounded-lg p-2 shadow-lg">
      <ToolbarButton
        onClick={onPrevious}
        disabled={currentIndex === 0}
        title="Previous Image"
      >
        ⬅️
      </ToolbarButton>
      <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
        {currentIndex + 1} / {numImages}
      </span>
      <ToolbarButton
        onClick={onNext}
        disabled={currentIndex === numImages - 1}
        title="Next Image"
      >
        ➡️
      </ToolbarButton>
    </div>
  );
});

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
  const toolbarStyle = {
    position: 'absolute',
    top: fullView ? 20 : 16,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1001,
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '90vw',
  };

  return (
    <div style={toolbarStyle}>
      <div className="flex items-center gap-1 bg-white/90 rounded-lg p-1 shadow-lg">
        {TOOL_LIST.map((tool) => (
          <ToolbarButton
            key={tool.name}
            onClick={() => onToolActivate(tool.name)}
            title={tool.label}
            isActive={activeTool === tool.name}
          >
            {tool.icon}
          </ToolbarButton>
        ))}
      </div>
      
      <ZoomControls
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onReset={onResetZoom}
      />
      
      {numImages > 1 && (
        <ImageNavigation
          currentIndex={currentIndex}
          numImages={numImages}
          onPrevious={onPreviousImage}
          onNext={onNextImage}
        />
      )}
      
      <ToolbarButton
        onClick={onFullScreenToggle}
        title={fullView ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {fullView ? '⛌' : '⛶'}
      </ToolbarButton>
    </div>
  );
});

const InstructionsOverlay = React.memo(function InstructionsOverlay({ error }) {
  if (error) return null;
  
  return (
    <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg text-sm">
      <div className="flex items-center gap-2 mb-1">
        <span>🖱️</span>
        <span>Left: Window/Level | Middle: Pan | Right: Zoom | Wheel: Scroll</span>
      </div>
      <div className="flex items-center gap-2">
        <span>⌨️</span>
        <span>Arrow Keys: Navigate | F: Fullscreen | ESC: Exit</span>
      </div>
    </div>
  );
});

const Spinner = React.memo(function Spinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
});

const MetadataOverlay = React.memo(function MetadataOverlay({ metadata }) {
  if (!metadata) return null;
  
  return (
    <div className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-lg text-xs max-w-[200px]">
      <div className="space-y-1">
        <div>Size: {metadata.rows} × {metadata.columns}</div>
        <div>Window: {metadata.windowWidth} / {metadata.windowCenter}</div>
        {metadata.modality && <div>Modality: {metadata.modality}</div>}
        {metadata.slice && <div>Slice: {metadata.slice}</div>}
      </div>
    </div>
  );
});

const ErrorMessage = React.memo(function ErrorMessage({ error }) {
  if (!error) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 text-white p-6 rounded-lg">
      <div className="text-center">
        <div className="text-2xl mb-2">⚠️</div>
        <div className="font-medium mb-2">Error Loading DICOM</div>
        <div className="text-sm opacity-90">{error}</div>
      </div>
    </div>
  );
});

// Main DicomViewer Component
function DicomViewerComponent({ imageUrls = [] }) {
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

export default DicomViewerComponent; 