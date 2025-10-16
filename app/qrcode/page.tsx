'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download, Printer } from 'lucide-react'

export default function QRCodePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [menuUrl, setMenuUrl] = useState('')

  useEffect(() => {
    // Ottieni l'URL corrente del sito
    const url = window.location.origin
    setMenuUrl(url)

    // Genera il QR code
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
    }
  }, [])

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'menu-qrcode-pizzeria-centro.png'
      link.href = url
      link.click()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            QR Code Menu Digitale
          </h1>
          <p className="text-xl text-gray-600">
            Pizzeria Centro
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Scannerizza questo QR code per visualizzare il menu
          </p>
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex flex-col items-center">
            <div className="bg-white p-6 rounded-xl border-4 border-red-500 mb-6">
              <canvas ref={canvasRef} />
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-1">URL del menu:</p>
              <p className="text-lg font-mono text-red-600 break-all">
                {menuUrl}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-lg"
              >
                <Download className="w-5 h-5" />
                Scarica QR Code
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition shadow-lg print:hidden"
              >
                <Printer className="w-5 h-5" />
                Stampa
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Come usare il QR Code:
          </h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>
                Scarica l'immagine del QR code usando il pulsante "Scarica QR Code"
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>
                Stampa il QR code su un foglio A4 o su cartoncino plastificato
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>
                Posiziona il QR code sui tavoli della pizzeria
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span>
                I clienti possono scansionare il codice con la fotocamera del telefono per accedere al menu
              </span>
            </li>
          </ol>
        </div>

        {/* Print styles */}
        <style jsx global>{`
          @media print {
            body {
              background: white !important;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
