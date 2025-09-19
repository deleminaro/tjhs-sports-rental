import React, { useState } from 'react';
import { Equipment } from '@/types';
import { QrCode, Download, Copy } from 'lucide-react';

interface QRCodeGeneratorProps {
  equipment: Equipment;
  onClose: () => void;
}

export default function QRCodeGenerator({ equipment, onClose }: QRCodeGeneratorProps) {
  const [qrCodeData, setQrCodeData] = useState<string>('');

  // Generate QR code data URL (simplified - in real app you'd use a QR library)
  const generateQRCode = () => {
    const data = {
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      sport: equipment.sport,
      timestamp: new Date().toISOString()
    };
    
    // In a real app, you'd use a QR code library like 'qrcode'
    // For now, we'll create a simple data representation
    const qrData = `TJHS-RENTAL:${equipment.id}:${equipment.name}:${equipment.sport}`;
    setQrCodeData(qrData);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrData);
    alert('QR Code data copied to clipboard!');
  };

  const downloadQRCode = () => {
    // In a real app, you'd generate and download the actual QR code image
    const element = document.createElement('a');
    const file = new Blob([qrData], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `qr-${equipment.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            QR Code for {equipment.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <div className="text-center">
          <div className="bg-gray-100 p-8 rounded-lg mb-4">
            {qrCodeData ? (
              <div className="space-y-2">
                <div className="text-sm font-mono bg-white p-2 rounded border">
                  {qrData}
                </div>
                <p className="text-xs text-gray-500">
                  QR Code Data (scan with camera)
                </p>
              </div>
            ) : (
              <div className="text-gray-500">
                <QrCode className="h-16 w-16 mx-auto mb-2" />
                <p>Click "Generate QR Code" to create</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <button
              onClick={generateQRCode}
              className="w-full bg-tjhs-blue hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </button>
            
            {qrCodeData && (
              <>
                <button
                  onClick={copyToClipboard}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Data
                </button>
                
                <button
                  onClick={downloadQRCode}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p><strong>Instructions:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Generate QR code for this equipment</li>
            <li>Print and attach to equipment</li>
            <li>Students can scan to quickly rent</li>
            <li>Teachers can scan to return equipment</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
