import React from 'react';
import { createRoot } from 'react-dom/client';

// Main Cut Editor App Component
const CutEditorApp: React.FC = () => {
  const [selectedFrameType, setSelectedFrameType] = React.useState<string>('2x2');
  const [images, setImages] = React.useState<string[]>([]);

  const handleFileUpload = async () => {
    try {
      if (!window.electronAPI?.openFile) {
        return;
      }

      const fileData = await window.electronAPI.openFile();
      if (fileData && Array.isArray(fileData)) {
        const imageUrls = fileData.map(file => file.data);
        setImages(imageUrls);
      }
    } catch (error) {
      // Handle the error gracefully without triggering browser defaults
    }
  };

  const frameTypes = [
    { id: '2x2', name: '2x2 Grid', slots: 4 },
    { id: '3x3', name: '3x3 Grid', slots: 9 },
    { id: '1x4', name: '1x4 Strip', slots: 4 },
    { id: '4x1', name: '4x1 Strip', slots: 4 },
  ];

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: '60px',
          backgroundColor: '#1f2937',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '18px' }}>Cut Editor - React Working! 🚀</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              void handleFileUpload();
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            이미지 불러오기
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex' }}>
        {/* Sidebar */}
        <div
          style={{
            width: '250px',
            backgroundColor: '#f3f4f6',
            padding: '20px',
            borderRight: '1px solid #d1d5db',
          }}
        >
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>프레임 선택</h3>

          {frameTypes.map(frame => (
            <button
              key={frame.id}
              onClick={() => setSelectedFrameType(frame.id)}
              style={{
                width: '100%',
                padding: '12px',
                margin: '5px 0',
                backgroundColor: selectedFrameType === frame.id ? '#3b82f6' : 'white',
                color: selectedFrameType === frame.id ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {frame.name} ({frame.slots}칸)
            </button>
          ))}

          <div style={{ marginTop: '30px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>불러온 이미지</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {images.map((imageUrl, index) => (
                <div
                  key={index}
                  style={{
                    width: '100%',
                    height: '80px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              ))}
              {images.length === 0 && (
                <div
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '14px',
                  }}
                >
                  이미지를 불러와 주세요
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '400px',
              height: '400px',
              backgroundColor: '#f9fafb',
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {selectedFrameType === '2x2' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                  gap: '4px',
                  width: '100%',
                  height: '100%',
                  padding: '10px',
                }}
              >
                {[1, 2, 3, 4].map(slot => (
                  <div
                    key={slot}
                    style={{
                      backgroundColor: '#e5e7eb',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#6b7280',
                    }}
                  >
                    {images[slot - 1] ? (
                      <img
                        src={images[slot - 1]}
                        alt={`Slot ${slot}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    ) : (
                      `칸 ${slot}`
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedFrameType === '3x3' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gridTemplateRows: '1fr 1fr 1fr',
                  gap: '4px',
                  width: '100%',
                  height: '100%',
                  padding: '10px',
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(slot => (
                  <div
                    key={slot}
                    style={{
                      backgroundColor: '#e5e7eb',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#6b7280',
                    }}
                  >
                    {images[slot - 1] ? (
                      <img
                        src={images[slot - 1]}
                        alt={`Slot ${slot}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    ) : (
                      `칸 ${slot}`
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedFrameType === '1x4' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gridTemplateRows: '1fr 1fr 1fr 1fr',
                  gap: '4px',
                  width: '100%',
                  height: '100%',
                  padding: '10px',
                }}
              >
                {[1, 2, 3, 4].map(slot => (
                  <div
                    key={slot}
                    style={{
                      backgroundColor: '#e5e7eb',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#6b7280',
                    }}
                  >
                    {images[slot - 1] ? (
                      <img
                        src={images[slot - 1]}
                        alt={`Slot ${slot}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    ) : (
                      `칸 ${slot}`
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedFrameType === '4x1' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  gridTemplateRows: '1fr',
                  gap: '4px',
                  width: '100%',
                  height: '100%',
                  padding: '10px',
                }}
              >
                {[1, 2, 3, 4].map(slot => (
                  <div
                    key={slot}
                    style={{
                      backgroundColor: '#e5e7eb',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#6b7280',
                    }}
                  >
                    {images[slot - 1] ? (
                      <img
                        src={images[slot - 1]}
                        alt={`Slot ${slot}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    ) : (
                      `칸 ${slot}`
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div
        style={{
          height: '30px',
          backgroundColor: '#f3f4f6',
          borderTop: '1px solid #d1d5db',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          fontSize: '12px',
          color: '#6b7280',
        }}
      >
        ✅ React Status: Active | 선택된 프레임:{' '}
        {frameTypes.find(f => f.id === selectedFrameType)?.name} | 불러온 이미지:{' '}
        {images.length}개
      </div>
    </div>
  );
};

// Wait for DOM and mount React
const initApp = () => {
  const container = document.getElementById('root');
  if (!container) {
    return;
  }

  const root = createRoot(container);
  root.render(<CutEditorApp />);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
