
import { History, TrendingUp, Send, Archive } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { HistoryList } from '../../components/history-list'
import { StatisticsCards } from '../../components/statistics-cards'

export default function HistoricoPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <History className="h-8 w-8 text-green-600" />
          <span>Histórico e Estatísticas</span>
        </h1>
        <p className="text-gray-600">
          Acompanhe o histórico de envios e métricas de performance do sistema
        </p>
      </div>

      {/* Statistics */}
      <StatisticsCards />

      {/* History List */}
      <HistoryList />
    </div>
  )
}
