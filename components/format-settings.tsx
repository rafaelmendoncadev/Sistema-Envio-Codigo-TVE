
'use client'

import { useState } from 'react'
import { Type, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

export function FormatSettings() {
  const [format, setFormat] = useState('{{columnA}} - {{columnD}}')
  const [preview, setPreview] = useState('A123 - D456')

  const updatePreview = (newFormat: string) => {
    const exampleA = 'A123'
    const exampleD = 'D456'
    const newPreview = newFormat
      .replace(/\{\{columnA\}\}/g, exampleA)
      .replace(/\{\{columnD\}\}/g, exampleD)
    setPreview(newPreview)
  }

  const handleFormatChange = (value: string) => {
    setFormat(value)
    updatePreview(value)
  }

  const saveFormat = async () => {
    // TODO: Implement save format logic
    console.log('Saving format:', format)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Type className="h-5 w-5 text-blue-600" />
          <span>Formato de Saída</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="format">Formato personalizado</Label>
          <Input
            id="format"
            value={format}
            onChange={(e) => handleFormatChange(e.target.value)}
            placeholder="{{columnA}} - {{columnD}}"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use {'{{columnA}} e {{columnD}}'} como placeholders
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Preview:</span>
          </div>
          <div className="font-mono text-lg font-semibold text-gray-900">
            {preview}
          </div>
        </div>

        <Button onClick={saveFormat} className="w-full">
          Salvar Formato
        </Button>
      </CardContent>
    </Card>
  )
}
