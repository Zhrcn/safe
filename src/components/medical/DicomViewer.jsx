import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Hammer from 'hammerjs';

import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

if (typeof window !== 'undefined') {
  window.Hammer = Hammer;
}

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

cornerstoneWADOImageLoader.webWorkerManager.initialize({
  webWorkerPath: '/cornerstoneWADOImageLoaderWebWorker.js',
  taskConfiguration: {
    decodeTask: {
      codecsPath: '/cornerstoneWADOImageLoaderCodecs.js',
    },
  },
});

const TOOL_LIST = [
  { name: 'Wwwc', label: 'Window/Level', icon: '🌗' },
  { name: 'StackScrollMouseWheel', label: 'Scroll', icon: '🖱️' },
];

const ZOOM_FACTOR = 1.2;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;

function useCornerstone(imageUrls, currentIndex, activeTool) {
  const elementRef = useRef(null);
  const [numImages, setNumImages] = useState(0);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const getImageIds = useCallback(() => (
    imageUrls.map((url) => (url.startsWith('wadouri:') ? url : `wadouri:${url}`))
  ), [imageUrls]);

  useEffect(() => {
    [
      { name: 'Wwwc', tool: cornerstoneTools.WwwcTool },
      { name: 'Pan', tool: cornerstoneTools.PanTool },
      { name: 'Zoom', tool: cornerstoneTools.ZoomTool },
      { name: 'StackScrollMouseWheel', tool: cornerstoneTools.StackScrollMouseWheelTool },
    ].forEach(({ name, tool }) => {
      if (!cornerstoneTools.getToolForElement || !cornerstoneTools.getToolForElement(document.createElement('div'), name)) {
        if (tool && cornerstoneTools.addTool) {
          try {
            cornerstoneTools.addTool(tool);
          } catch (e) {}
        }
      }
    });
  }, []);

  const activateTool = useCallback(
    (toolName) => {
      if (!elementRef.current) return;
      TOOL_LIST.forEach((tool) => {
        try {
          cornerstoneTools.setToolDisabled(tool.name, {});
        } catch (e) {}
      });

      try {
        let config = {};
        if (toolName === 'Wwwc') {
          config = { mouseButtonMask: 1 }; 
        } else if (toolName === 'Pan') {
          config = { mouseButtonMask: 4 }; 
        } else if (toolName === 'Zoom') {
          config = { mouseButtonMask: 2 }; 
        } else if (toolName === 'StackScrollMouseWheel') {
          config = {}; 
        }
        cornerstoneTools.setToolActive(toolName, config);
      } catch (e) {}
    },
    []
  );

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

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !imageUrls.length) return;

    if (typeof cornerstone === 'undefined' || typeof cornerstoneTools === 'undefined') return;

    cornerstone.enable(element);

    const imageIds = getImageIds();
    setNumImages(imageIds.length);

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

        if (!cornerstoneTools.store || !cornerstoneTools.store.state) {
          cornerstoneTools.init();
        }

        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);

        TOOL_LIST.forEach((tool) => {
          try {
            const ToolClass = cornerstoneTools[tool.name + 'Tool'];
            if (ToolClass) {
              cornerstoneTools.addTool(ToolClass);
            }
          } catch (e) {}
        });

        activateTool(activeTool);

        toolCleanup = () => {
          try {
            TOOL_LIST.forEach((tool) => {
              cornerstoneTools.setToolDisabled(tool.name, {});
            });
          } catch (e) {}
        };
      })
      .catch((err) => {
        setError('Failed to load DICOM image. Please check the file or try again.');
        console.error('Error loading DICOM image:', err);
      });

    return () => {
      toolCleanup();
      try {
        cornerstone.disable(element);
      } catch (e) {}
    };
  }, [imageUrls, currentIndex, activeTool, activateTool, getImageIds]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const preventContextMenu = (e) => {
      if (activeTool === 'Pan') {
        e.preventDefault();
      }
    };
    element.addEventListener('contextmenu', preventContextMenu);

    return () => {
      element.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [activeTool]);

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

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const exitHandler = () => {
      if (!document.fullscreenElement) {
        setFullView(false);
      }
    };
    document.addEventListener('fullscreenchange', exitHandler);
    return () => document.removeEventListener('fullscreenchange', exitHandler);
  }, []);

  const handleFullScreenToggle = useCallback(() => {
    if (typeof document === 'undefined') return;
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

function useKeyboardNavigation(currentIndex, numImages, goToImage, toggleFullView) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
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
        background: isActive ? 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)' : 'rgba(255,255,255,0.04)',
        color: isActive ? '#fff' : '#1976d2',
        border: isActive ? '1.5px solid #1976d2' : '1.5px solid #e3eaf3',
        borderRadius: 6,
        padding: '6px 14px',
        marginRight: 4,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: isActive ? 700 : 500,
        fontSize: 15,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        opacity: disabled ? 0.5 : 1,
        boxShadow: isActive ? '0 2px 8px rgba(25,118,210,0.10)' : 'none',
        transition: 'all 0.15s cubic-bezier(.4,2,.6,1)',
        ...style,
      }}
      type="button"
    >
      {children}
    </button>
  );
});

const ZoomControls = React.memo(function ZoomControls({ onZoomIn, onZoomOut, onReset }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 8 }}>
      <ToolbarButton
        onClick={onZoomIn}
        title="Zoom In"
        style={{ fontSize: 18, padding: '6px 10px' }}
      >
        <span role="img" aria-label="Zoom In">➕</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={onZoomOut}
        title="Zoom Out"
        style={{ fontSize: 18, padding: '6px 10px' }}
      >
        <span role="img" aria-label="Zoom Out">➖</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={onReset}
        title="Reset Zoom"
        style={{ fontSize: 18, padding: '6px 10px' }}
      >
        <span role="img" aria-label="Reset Zoom">🔄</span>
      </ToolbarButton>
    </div>
  );
});

const ImageNavigation = React.memo(function ImageNavigation({ currentIndex, numImages, onPrevious, onNext }) {
  if (numImages <= 1) return null;
  return (
    <div style={{ color: '#1976d2', fontSize: 14, marginLeft: 12, display: 'flex', alignItems: 'center', gap: 2 }}>
      <ToolbarButton
        onClick={onPrevious}
        title="Previous Image (←)"
        disabled={currentIndex === 0}
        style={{ fontSize: 16, padding: '6px 8px' }}
      >
        <span role="img" aria-label="Previous">◀</span>
      </ToolbarButton>
      <span style={{
        minWidth: 48,
        display: 'inline-block',
        textAlign: 'center',
        fontWeight: 600,
        color: '#222',
        background: '#e3eaf3',
        borderRadius: 6,
        padding: '4px 10px',
        margin: '0 2px'
      }}>
        {currentIndex + 1} / {numImages}
      </span>
      <ToolbarButton
        onClick={onNext}
        title="Next Image (→)"
        disabled={currentIndex === numImages - 1}
        style={{ fontSize: 16, padding: '6px 8px' }}
      >
        <span role="img" aria-label="Next">▶</span>
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
  return (
    <div
      style={{
        position: 'absolute',
        top: 18,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        gap: 10,
        background: 'rgba(255,255,255,0.98)',
        borderRadius: 12,
        padding: '10px 24px',
        alignItems: 'center',
        boxShadow: '0 4px 24px rgba(25,118,210,0.10)',
        border: '1.5px solid #e3eaf3',
        minHeight: 54,
      }}
    >
      <ToolbarButton
        onClick={onFullScreenToggle}
        title={fullView ? 'Exit Full View (F)' : 'Full View (F)'}
        style={{
          fontSize: 22,
          marginRight: 10,
          padding: '6px 10px',
          background: fullView ? 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)' : 'rgba(255,255,255,0.04)',
          color: fullView ? '#fff' : '#1976d2',
        }}
        isActive={fullView}
      >
        {fullView ? <span role="img" aria-label="Exit Fullscreen">🗗</span> : <span role="img" aria-label="Fullscreen">🗖</span>}
      </ToolbarButton>
      <div className='flex ' style={{ display: 'flex', gap: 2 }}>
        {TOOL_LIST.map((tool) => (
          <ToolbarButton
            key={tool.name}
            onClick={() => onToolActivate(tool.name)}
            isActive={activeTool === tool.name}
            title={tool.label}
          >
            <span style={{ fontSize: 18 }}>{tool.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{tool.label}</span>
          </ToolbarButton>
        ))}
      </div>
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

const InstructionsOverlay = React.memo(function InstructionsOverlay({ error }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: error ? 54 : 18,
        left: 0,
        width: '100%',
        textAlign: 'center',
        color: '#1976d2',
        fontSize: 14,
        pointerEvents: 'none',
        zIndex: 10,
        textShadow: '0 1px 2px #fff',
        fontWeight: 500,
        letterSpacing: 0.1,
        opacity: 0.92,
      }}
    >
      <span>
        <span style={{ fontWeight: 700 }}>Mouse:</span> Left=Window/Level, Middle=Zoom, Right=Pan, Scroll=Slice. &nbsp;|&nbsp;
        <span style={{ fontWeight: 700 }}>Keyboard:</span> ←/→ = Prev/Next, F = Full View
      </span>
    </div>
  );
});

const Spinner = React.memo(function Spinner() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 100,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
    }}>
      <div style={{
        width: 54,
        height: 54,
        border: '6px solid #e3eaf3',
        borderTop: '6px solid #1976d2',
        borderRadius: '50%',
        animation: 'dicom-spin 1s linear infinite',
        background: 'rgba(255,255,255,0.7)',
        boxShadow: '0 2px 8px rgba(25,118,210,0.10)',
      }} />
      <span style={{ color: '#1976d2', fontWeight: 600, fontSize: 15, letterSpacing: 0.2 }}>Loading...</span>
      <style>{`
        @keyframes dicom-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

const MetadataOverlay = React.memo(function MetadataOverlay({ metadata }) {
  if (!metadata) return null;
  return (
    <div style={{
      position: 'absolute',
      top: 18,
      right: 18,
      background: 'rgba(255,255,255,0.98)',
      color: '#1976d2',
      borderRadius: 12,
      padding: '14px 22px',
      fontSize: 14,
      zIndex: 30,
      boxShadow: '0 4px 24px rgba(25,118,210,0.10)',
      minWidth: 140,
      maxWidth: 260,
      pointerEvents: 'none',
      lineHeight: 1.7,
      border: '1.5px solid #e3eaf3',
      fontWeight: 500,
    }}>
      <div><b>Modality:</b> <span style={{ color: '#222' }}>{metadata.modality || 'N/A'}</span></div>
      <div><b>Size:</b> <span style={{ color: '#222' }}>{metadata.rows} x {metadata.columns}</span></div>
      <div><b>Slice:</b> <span style={{ color: '#222' }}>{metadata.slice || 'N/A'}</span></div>
      <div><b>Window:</b> <span style={{ color: '#222' }}>{metadata.windowWidth} / {metadata.windowCenter}</span></div>
    </div>
  );
});

const ErrorMessage = React.memo(function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'absolute',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        minWidth: 240,
        maxWidth: 440,
        textAlign: 'center',
        color: '#fff',
        fontSize: 17,
        fontWeight: 700,
        background: 'linear-gradient(90deg, #d32f2f 0%, #b71c1c 100%)',
        padding: '16px 28px',
        zIndex: 30,
        borderRadius: 14,
        boxShadow: '0 4px 24px rgba(211,47,47,0.10)',
        pointerEvents: 'none',
        textShadow: '0 1px 2px #000',
        letterSpacing: 0.1,
      }}
    >
      {error}
    </div>
  );
});

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

  const handleZoomIn = useCallback(() => handleZoom(ZOOM_FACTOR), [handleZoom]);
  const handleZoomOut = useCallback(() => handleZoom(1 / ZOOM_FACTOR), [handleZoom]);

  useKeyboardNavigation(currentIndex, numImages, goToImage, handleFullScreenToggle);

  const containerStyles = useMemo(() => ({
    position: 'relative',
    width: fullView ? '100vw' : 'min(98vw, 860px)',
    height: fullView ? '100vh' : 'min(90vh, 900px)', 
    background: 'linear-gradient(120deg, #e3eaf3 0%, #f5fafd 100%)',
    margin: '0 auto',
    borderRadius: fullView ? 0 : 22,
    boxShadow: fullView ? '0 0 0 9999px rgba(25,118,210,0.18)' : '0 4px 32px rgba(25,118,210,0.10)',
    zIndex: fullView ? 1000 : 'auto',
    transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    outline: fullView ? '2.5px solid #1976d2' : 'none',
    border: fullView ? 'none' : '1.5px solid #e3eaf3',
  }), [fullView]);

  const dicomElementStyles = useMemo(() => ({
    width: '100%',
    height: '100%',
    backgroundColor: '#111',
    outline: 'none',
    borderRadius: fullView ? 0 : 16,
    display: 'block',
    boxShadow: fullView ? 'none' : '0 2px 8px rgba(25,118,210,0.08)',
    border: '1.5px solid #e3eaf3',
    marginTop: 70,
    marginBottom: 18,
  }), [fullView]);

  useEffect(() => {
    if (!elementRef.current || !imageUrls.length) return;
    setLoading(true);
    setMetadata(null);
    const imageIds = imageUrls.map((url) => url.startsWith('wadouri:') ? url : `wadouri:${url}`);
    cornerstone
      .loadImage(imageIds[currentIndex])
      .then((image) => {
        setLoading(false);
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
