
'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Send, Archive, FileSpreadsheet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface Statistics {
  totalCodes: number;
  sentCodes: number;
  archivedCodes: number;
  totalSessions: number;
}

export function StatisticsCards() {
  const [stats, setStats] = useState<Statistics>({
    totalCodes: 0,
    sentCodes: 0,
    archivedCodes: 0,
    totalSessions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/statistics')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error loading statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    {
      title: 'Total de Códigos',
      value: stats.totalCodes,
      icon: FileSpreadsheet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Códigos Enviados',
      value: stats.sentCodes,
      icon: Send,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Códigos Arquivados',
      value: stats.archivedCodes,
      icon: Archive,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Sessões de Upload',
      value: stats.totalSessions,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-1.5 sm:p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-gray-900">
                {loading ? '-' : card.value.toLocaleString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
