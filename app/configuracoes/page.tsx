
import { Settings, Wifi, Mail, MessageSquare, Book } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { WhatsAppSettings } from '../../components/whatsapp-settings'
import { EmailSettings } from '../../components/email-settings'
import { FormatSettings } from '../../components/format-settings'
import { Tutorials } from '../../components/tutorials'

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-2 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center space-x-2 sm:space-x-3">
          <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <span>Configurações</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Configure as integrações e personalize o formato de saída dos códigos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Format Settings */}
        <FormatSettings />

        {/* WhatsApp Settings */}
        <WhatsAppSettings />

        {/* Email Settings */}
        <EmailSettings />

        {/* Tutorials */}
        <Tutorials />
      </div>
    </div>
  )
}
