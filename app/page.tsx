
import { Upload, FileSpreadsheet, Download } from 'lucide-react'
import { UploadArea } from '../components/upload-area'
import { CodesGrid } from '../components/codes-grid'

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Sistema de Códigos de Recarga
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Faça upload de planilhas Excel para extrair e gerenciar códigos de recarga automaticamente
        </p>
      </div>

      {/* Upload Area */}
      <UploadArea />

      {/* Codes Grid */}
      <CodesGrid />
    </div>
  )
}
