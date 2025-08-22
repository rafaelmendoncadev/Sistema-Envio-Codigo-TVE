'use client'

import { useState, useEffect } from 'react'
import { Search, Copy, CheckSquare, Square, Archive, ArchiveRestore } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import { Code } from '../lib/types'
import { toast } from 'sonner'

export function ArchivedCodesGrid() {
  const [codes, setCodes] = useState<Code[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])

  const fetchArchivedCodes = async () => {
    try {
      const response = await fetch('/api/codes?status=archived')
      const data = await response.json()
      setCodes(data.codes || [])
    } catch (error) {
      toast.error('Erro ao carregar códigos arquivados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArchivedCodes()
    
    // Adicionar listener para o evento personalizado
    const handleCodesUpdated = () => {
      fetchArchivedCodes()
    }
    
    window.addEventListener('codesUpdated', handleCodesUpdated)
    
    // Limpar o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('codesUpdated', handleCodesUpdated)
    }
  }, [])

  const filteredCodes = codes.filter(code => {
    const matchesSearch = code.combinedCode?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                         code.columnAValue?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                         code.columnDValue?.toLowerCase()?.includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleSelectCode = (codeId: string) => {
    setSelectedCodes(prev => 
      prev.includes(codeId) 
        ? prev.filter(id => id !== codeId)
        : [...prev, codeId]
    )
  }

  const handleSelectAll = () => {
    if (selectedCodes.length === filteredCodes.length) {
      setSelectedCodes([])
    } else {
      setSelectedCodes(filteredCodes.map(code => code.id))
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Código copiado para a área de transferência!')
    } catch (error) {
      toast.error('Erro ao copiar código')
    }
  }

  const copySelectedCodes = async (codeIds: string[]) => {
    try {
      const selectedCodesData = codes.filter(code => codeIds.includes(code.id))
      const codesText = selectedCodesData.map(code => code.combinedCode).join('\n')
      await navigator.clipboard.writeText(codesText)
      toast.success(`${selectedCodesData.length} códigos copiados para a área de transferência!`)
    } catch (error) {
      toast.error('Erro ao copiar códigos selecionados')
    }
  }

  const copyAllCodes = async () => {
    try {
      const allCodesText = filteredCodes.map(code => code.combinedCode).join('\n')
      await navigator.clipboard.writeText(allCodesText)
      toast.success(`${filteredCodes.length} códigos copiados para a área de transferência!`)
    } catch (error) {
      toast.error('Erro ao copiar todos os códigos')
    }
  }

  const handleUnarchive = async (codeIds: string[]) => {
    try {
      const response = await fetch('/api/codes/unarchive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code_ids: codeIds })
      })

      if (response.ok) {
        toast.success('Códigos desarquivados com sucesso!')
        fetchArchivedCodes()
        setSelectedCodes([])
        // Disparar evento para atualizar outros componentes
        window.dispatchEvent(new CustomEvent('codesUpdated'))
      } else {
        toast.error('Erro ao desarquivar códigos')
      }
    } catch (error) {
      toast.error('Erro ao desarquivar códigos')
    }
  }

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date)
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Carregando códigos arquivados...</p>
        </CardContent>
      </Card>
    )
  }

  if (codes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <div className="text-gray-400">
            <Archive className="h-12 w-12 mx-auto mb-3" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Nenhum código arquivado</h3>
            <p className="text-gray-500">Os códigos arquivados aparecerão aqui</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>Códigos Arquivados</span>
              <Badge variant="secondary">{filteredCodes.length} códigos</Badge>
            </CardTitle>
            {selectedCodes.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedCodes.length} selecionados
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selectedCodes.length > 0 && (
             <div className="mb-6">
               <div className="flex flex-col sm:flex-row gap-2">
                 <Button
                   size="sm"
                   variant="outline"
                   onClick={() => copySelectedCodes(selectedCodes)}
                   className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                 >
                   <Copy className="h-4 w-4" />
                   <span>Copiar Selecionados</span>
                 </Button>
                 <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyAllCodes()}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copiar Todos</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUnarchive(selectedCodes)}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <ArchiveRestore className="h-4 w-4" />
                    <span>Desarquivar</span>
                  </Button>
               </div>
             </div>
           )}
          
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar códigos arquivados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleSelectAll}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                {selectedCodes.length === filteredCodes.length ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Selecionar todos</span>
                <span className="sm:hidden">Selecionar</span>
              </Button>
            </div>
          </div>

          {/* Codes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredCodes.map((code) => (
              <Card key={code.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Checkbox
                      checked={selectedCodes.includes(code.id)}
                      onCheckedChange={() => handleSelectCode(code.id)}
                      className="mt-1"
                    />
                    <Badge className="bg-gray-100 text-gray-800">
                      Arquivado
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="font-mono text-sm sm:text-lg font-semibold text-gray-900 bg-gray-50 p-2 rounded break-all">
                      {code.combinedCode}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Coluna A: {code.columnAValue || 'N/A'}</p>
                      <p>Coluna D: {code.columnDValue || 'N/A'}</p>
                      <p>Linha: {code.rowNumber}</p>
                      {code.archivedAt && (
                        <p>Arquivado em: {formatDate(code.archivedAt)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center space-x-2">
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => copyToClipboard(code.combinedCode)}
                       className="flex items-center justify-center space-x-1"
                     >
                       <Copy className="h-3 w-3" />
                       <span className="text-xs hidden sm:inline">Copiar</span>
                     </Button>
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => handleUnarchive([code.id])}
                       className="flex items-center justify-center space-x-1"
                     >
                       <ArchiveRestore className="h-3 w-3" />
                       <span className="text-xs hidden sm:inline">Desarquivar</span>
                     </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}