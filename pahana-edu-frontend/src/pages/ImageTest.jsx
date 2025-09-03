import { useState } from "react";

export default function ImageTest() {
  const [fileInfo, setFileInfo] = useState(null);
  const [compressedInfo, setCompressedInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  async function compressImageFile(file, maxW = 400, maxH = 600, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          try {
            // Calculate new dimensions
            let { width, height } = img;
            const ratio = Math.min(maxW / width, maxH / height, 1);
            const targetW = Math.round(width * ratio);
            const targetH = Math.round(height * ratio);
            
            // Create canvas and compress
            const canvas = document.createElement("canvas");
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext("2d");
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, targetW, targetH);
            const compressed = canvas.toDataURL("image/jpeg", quality);
            
            resolve({
              dataUrl: compressed,
              dimensions: { width: targetW, height: targetH },
              originalDimensions: { width, height }
            });
          } catch (err) {
            reject(err);
          }
        };
        
        img.onerror = reject;
        img.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
      sizeKB: Math.round(file.size / 1024),
      sizeMB: Math.round(file.size / (1024 * 1024) * 100) / 100
    });

    try {
      // Test different compression levels
      const results = [];
      
      for (let quality = 0.9; quality >= 0.3; quality -= 0.1) {
        try {
          const result = await compressImageFile(file, 400, 600, quality);
          const sizeKB = Math.round(result.dataUrl.length / 1024);
          
          results.push({
            quality: Math.round(quality * 100),
            sizeKB,
            dimensions: result.dimensions,
            dataUrl: result.dataUrl
          });
          
          // Stop if we get a reasonable size
          if (sizeKB <= 50) break;
        } catch (err) {
          console.error(`Quality ${quality} failed:`, err);
        }
      }

      setCompressedInfo({
        results,
        bestResult: results[0] // First successful result
      });
    } catch (err) {
      console.error("Compression failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Image Compression Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <p className="text-sm text-gray-600 mt-2">
            This will test different compression levels to find the best balance of quality and size.
          </p>
        </div>

        {fileInfo && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Original File Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Name:</strong> {fileInfo.name}
              </div>
              <div>
                <strong>Type:</strong> {fileInfo.type}
              </div>
              <div>
                <strong>Size:</strong> {fileInfo.sizeKB}KB ({fileInfo.sizeMB}MB)
              </div>
              <div>
                <strong>Bytes:</strong> {fileInfo.size.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Processing image...</p>
          </div>
        )}

        {compressedInfo && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Compression Results</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Best Result:</h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg">
                <div>
                  <strong>Quality:</strong> {compressedInfo.bestResult.quality}%
                </div>
                <div>
                  <strong>Final Size:</strong> {compressedInfo.bestResult.sizeKB}KB
                </div>
                <div>
                  <strong>Dimensions:</strong> {compressedInfo.bestResult.dimensions.width} x {compressedInfo.bestResult.dimensions.height}
                </div>
                <div>
                  <strong>Compression:</strong> {Math.round((1 - compressedInfo.bestResult.sizeKB / fileInfo.sizeKB) * 100)}%
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Preview:</h3>
              <img
                src={compressedInfo.bestResult.dataUrl}
                alt="Compressed preview"
                className="max-w-xs rounded-lg border"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">All Compression Levels:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2">Quality</th>
                      <th className="border p-2">Size (KB)</th>
                      <th className="border p-2">Dimensions</th>
                      <th className="border p-2">Compression %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compressedInfo.results.map((result, index) => (
                      <tr key={index} className={index === 0 ? 'bg-green-50' : ''}>
                        <td className="border p-2">{result.quality}%</td>
                        <td className="border p-2">{result.sizeKB}KB</td>
                        <td className="border p-2">{result.dimensions.width} x {result.dimensions.height}</td>
                        <td className="border p-2">
                          {Math.round((1 - result.sizeKB / fileInfo.sizeKB) * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">How to Use This Test</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Upload an image that's giving you "too large" errors</li>
            <li>See how much it can be compressed</li>
            <li>Check if the final size is under 50KB (database limit)</li>
            <li>Use the compression settings that work best</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
