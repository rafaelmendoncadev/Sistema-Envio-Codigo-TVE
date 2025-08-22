
import { History, TrendingUp, Send, Archive } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { HistoryList } from '../../components/history-list'
import { StatisticsCards } from '../../components/statistics-cards'

export default function HistoricoPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-2 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center space-x-2 sm:space-x-3">
          <History className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          <span>Histórico e Estatísticas</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
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
