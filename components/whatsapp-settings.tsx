
'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, TestTube, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { toast } from 'sonner'

export function WhatsAppSettings() {
  const [settings, setSettings] = useState({
    accessToken: '',
    phoneNumberId: '',
    webhookUrl: ''
  })
  const [testing, setTesting] = useState(false)
  const [lastTest, setLastTest] = useState<Date | null>(null)
  const [testStatus, setTestStatus] = useState<'success' | 'failed' | null>(null)

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings/whatsapp')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        setLastTest(data.lastTested ? new Date(data.lastTested) : null)
      }
    } catch (error) {
      console.error('Error loading WhatsApp settings:', error)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const saveSettings = async () => {
    try {
      const response = await fetch('/api/settings/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast.success('Configurações do WhatsApp salvas!')
      } else {
        toast.error('Erro ao salvar configurações')
      }
    } catch (error) {
      toast.error('Erro ao salvar configurações')
    }
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/settings/test/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setTestStatus('success')
        setLastTest(new Date())
        toast.success('Conexão com WhatsApp testada com sucesso!')
      } else {
        setTestStatus('failed')
        toast.error('Falha no teste de conexão')
      }
    } catch (error) {
      setTestStatus('failed')
      toast.error('Erro ao testar conexão')
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            <span>WhatsApp Business API</span>
          </div>
          {testStatus && (
            <div className="flex items-center space-x-1">
              {testStatus === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-xs ${testStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {testStatus === 'success' ? 'Conectado' : 'Erro'}
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="access-token">Access Token</Label>
          <Input
            id="access-token"
            type="password"
            value={settings.accessToken}
            onChange={(e) => setSettings(prev => ({ ...prev, accessToken: e.target.value }))}
            placeholder="Digite seu access token"
          />
        </div>

        <div>
          <Label htmlFor="phone-number-id">Phone Number ID</Label>
          <Input
            id="phone-number-id"
            value={settings.phoneNumberId}
            onChange={(e) => setSettings(prev => ({ ...prev, phoneNumberId: e.target.value }))}
            placeholder="Digite o ID do número"
          />
        </div>

        <div>
          <Label htmlFor="webhook-url">Webhook URL (Opcional)</Label>
          <Input
            id="webhook-url"
            value={settings.webhookUrl}
            onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
            placeholder="https://sua-app.com/webhook"
          />
        </div>

        {lastTest && (
          <p className="text-xs text-gray-500">
            Último teste: {lastTest.toLocaleString('pt-BR')}
          </p>
        )}

        <div className="flex space-x-2">
          <Button onClick={saveSettings} className="flex-1">
            Salvar
          </Button>
          <Button
            variant="outline"
            onClick={testConnection}
            disabled={testing || !settings.accessToken || !settings.phoneNumberId}
          >
            <TestTube className="h-4 w-4 mr-1" />
            {testing ? 'Testando...' : 'Testar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
