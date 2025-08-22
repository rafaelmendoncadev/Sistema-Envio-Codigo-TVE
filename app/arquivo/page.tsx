import { Archive } from 'lucide-react'
import { ArchivedCodesGrid } from '../../components/archived-codes-grid'

export default function ArquivoPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 px-4 sm:px-0">
        <div className="flex items-center justify-center space-x-3">
          <Archive className="h-8 w-8 text-gray-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Códigos Arquivados
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Gerencie todos os códigos que foram arquivados. Você pode desarquivar códigos quando necessário.
        </p>
      </div>

      {/* Archived Codes Grid */}
      <ArchivedCodesGrid />
    </div>
  )
}