
'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MessageSquare, Mail, Archive, Copy, CheckSquare, Square } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Code } from '../lib/types'
import { toast } from 'sonner'

export function CodesGrid() {
  const [codes, setCodes] = useState<Code[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])

  const fetchCodes = async () => {
    try {
      const response = await fetch('/api/codes')
      const data = await response.json()
      setCodes(data.codes || [])
    } catch (error) {
      toast.error('Erro ao carregar códigos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCodes()
    
    // Adicionar listener para o evento personalizado
    const handleCodesUpdated = () => {
      fetchCodes()
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
    const matchesStatus = statusFilter === 'all' || code.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'sent':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível'
      case 'sent':
        return 'Enviado'
      case 'archived':
        return 'Arquivado'
      default:
        return status
    }
  }

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
      toast.success('Código copiado!')
    } catch (error) {
      toast.error('Erro ao copiar código')
    }
  }

  const handleSendWhatsApp = async (codeIds: string[]) => {
    const phoneNumber = prompt('Digite o número do WhatsApp (com DDD):')
    if (!phoneNumber) return

    try {
      const response = await fetch('/api/send/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code_ids: codeIds, phone_number: phoneNumber })
      })

      const result = await response.json()
      if (response.ok) {
        toast.success(`${result.sent_count} código(s) enviado(s) por WhatsApp`)
        fetchCodes()
      } else {
        toast.error(result.error || 'Erro ao enviar por WhatsApp')
      }
    } catch (error) {
      toast.error('Erro ao enviar por WhatsApp')
    }
  }

  const handleSendEmail = async (codeIds: string[]) => {
    const email = prompt('Digite o email do destinatário:')
    if (!email) return

    try {
      const response = await fetch('/api/send/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code_ids: codeIds, email })
      })

      const result = await response.json()
      if (response.ok) {
        toast.success(`${result.sent_count} código(s) enviado(s) por email`)
        fetchCodes()
      } else {
        toast.error(result.error || 'Erro ao enviar por email')
      }
    } catch (error) {
      toast.error('Erro ao enviar por email')
    }
  }

  const handleArchive = async (codeIds: string[]) => {
    try {
      const response = await fetch('/api/codes/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code_ids: codeIds })
      })

      if (response.ok) {
        toast.success('Códigos arquivados')
        fetchCodes()
        setSelectedCodes([])
      } else {
        toast.error('Erro ao arquivar códigos')
      }
    } catch (error) {
      toast.error('Erro ao arquivar códigos')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Carregando códigos...</p>
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
            <h3 className="text-lg font-medium text-gray-900">Nenhum código encontrado</h3>
            <p className="text-gray-500">Faça upload de uma planilha Excel para começar</p>
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
              <span>Códigos Extraídos</span>
              <Badge variant="secondary">{filteredCodes.length} códigos</Badge>
            </CardTitle>
            {selectedCodes.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedCodes.length} selecionados
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendWhatsApp(selectedCodes)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendEmail(selectedCodes)}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleArchive(selectedCodes)}
                >
                  <Archive className="h-4 w-4 mr-1" />
                  Arquivar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar códigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="available">Disponível</SelectItem>
                <SelectItem value="sent">Enviado</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleSelectAll}
              className="flex items-center space-x-2"
            >
              {selectedCodes.length === filteredCodes.length ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span>Selecionar todos</span>
            </Button>
          </div>

          {/* Codes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCodes.map((code) => (
              <Card key={code.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Checkbox
                      checked={selectedCodes.includes(code.id)}
                      onCheckedChange={() => handleSelectCode(code.id)}
                    />
                    <Badge className={getStatusColor(code.status)}>
                      {getStatusLabel(code.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="font-mono text-lg font-semibold text-gray-900 bg-gray-50 p-2 rounded">
                      {code.combinedCode}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Coluna A: {code.columnAValue || 'N/A'}</p>
                      <p>Coluna D: {code.columnDValue || 'N/A'}</p>
                      <p>Linha: {code.rowNumber}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(code.combinedCode)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendWhatsApp([code.id])}
                    >
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendEmail([code.id])}
                    >
                      <Mail className="h-3 w-3" />
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
