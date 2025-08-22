
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileSpreadsheet, X, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { toast } from 'sonner'

export function UploadArea() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ]
      
      if (validTypes.includes(file.type)) {
        setFile(file)
        setUploadSuccess(false)
      } else {
        toast.error('Apenas arquivos Excel (.xlsx, .xls) são aceitos')
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  })

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadSuccess(true)
        toast.success(`${result.total_count} códigos extraídos com sucesso!`)
        // Emitir um evento personalizado para notificar o CodesGrid
        window.dispatchEvent(new CustomEvent('codesUpdated'))
      } else {
        toast.error(result.error || 'Erro ao processar arquivo')
      }
    } catch (error) {
      toast.error('Erro ao fazer upload do arquivo')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setUploadSuccess(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-4 sm:p-6">
        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  {isDragActive ? 'Solte o arquivo aqui' : 'Arraste seu arquivo Excel aqui'}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 px-2">
                  ou clique para selecionar um arquivo (.xlsx, .xls)
                </p>
              </div>
              <div className="text-blue-600 font-medium text-sm sm:text-base">
                Clique para selecionar
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <FileSpreadsheet className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{file.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!uploadSuccess && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {uploadSuccess ? (
              <div className="flex items-center justify-center space-x-2 py-3 sm:py-4 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium text-sm sm:text-base">Arquivo processado com sucesso!</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 w-full sm:w-auto"
                >
                  {uploading ? 'Processando...' : 'Processar Arquivo'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={removeFile}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
