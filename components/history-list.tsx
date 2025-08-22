
'use client'

import { useState, useEffect } from 'react'
import { Calendar, MessageSquare, Mail, Archive, ArchiveRestore, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { HistoryItem } from '../lib/types'

export function HistoryList() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history')
        const data = await response.json()
        setHistory(data.history || [])
      } catch (error) {
        console.error('Error loading history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'send_whatsapp':
        return <MessageSquare className="h-4 w-4 text-green-600" />
      case 'send_email':
        return <Mail className="h-4 w-4 text-blue-600" />
      case 'archive':
        return <Archive className="h-4 w-4 text-yellow-600" />
      case 'unarchive':
        return <ArchiveRestore className="h-4 w-4 text-purple-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'send_whatsapp':
        return 'Envio WhatsApp'
      case 'send_email':
        return 'Envio Email'
      case 'archive':
        return 'Arquivado'
      case 'unarchive':
        return 'Desarquivado'
      default:
        return actionType
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return 'Sucesso'
      case 'failed':
        return 'Falhou'
      case 'pending':
        return 'Pendente'
      default:
        return status
    }
  }

  const filteredHistory = history.filter(item => {
    const matchesAction = actionFilter === 'all' || item.actionType === actionFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesDate = !dateFilter || 
      new Date(item.createdAt).toLocaleDateString('pt-BR').includes(dateFilter)
    
    return matchesAction && matchesStatus && matchesDate
  })

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Carregando histórico...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span className="text-lg sm:text-xl">Histórico de Ações</span>
          </div>
          <Badge variant="secondary" className="self-start sm:self-auto">
            {filteredHistory.length} registros
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:gap-4 mb-6">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por ação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as ações</SelectItem>
              <SelectItem value="send_whatsapp">Envio WhatsApp</SelectItem>
              <SelectItem value="send_email">Envio Email</SelectItem>
              <SelectItem value="archive">Arquivado</SelectItem>
              <SelectItem value="unarchive">Desarquivado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="success">Sucesso</SelectItem>
              <SelectItem value="failed">Falhou</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Filtrar por data..."
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-48"
          />
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum registro encontrado
            </h3>
            <p className="text-gray-500">
              {history.length === 0 
                ? 'Nenhuma ação foi registrada ainda' 
                : 'Tente ajustar os filtros para ver mais resultros'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors space-y-2 sm:space-y-0"
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {getActionIcon(item.actionType)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <span className="font-medium text-gray-900 text-sm sm:text-base">
                        {getActionLabel(item.actionType)}
                      </span>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusLabel(item.status)}
                      </Badge>
                    </div>
                    {item.destination && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Destino: {item.destination}
                      </p>
                    )}
                    {item.details && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {item.details}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 self-start sm:self-auto">
                  {new Date(item.createdAt).toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
