
'use client'

import { useState, useEffect } from 'react'
import { Mail, TestTube, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { toast } from 'sonner'

export function EmailSettings() {
  const [settings, setSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    useSsl: true
  })
  const [testing, setTesting] = useState(false)
  const [lastTest, setLastTest] = useState<Date | null>(null)
  const [testStatus, setTestStatus] = useState<'success' | 'failed' | null>(null)

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings/email')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        setLastTest(data.lastTested ? new Date(data.lastTested) : null)
      }
    } catch (error) {
      console.error('Error loading Email settings:', error)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const saveSettings = async () => {
    try {
      const response = await fetch('/api/settings/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast.success('Configurações de Email salvas!')
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
      const response = await fetch('/api/settings/test/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setTestStatus('success')
        setLastTest(new Date())
        toast.success('Conexão SMTP testada com sucesso!')
      } else {
        setTestStatus('failed')
        toast.error('Falha no teste de conexão SMTP')
      }
    } catch (error) {
      setTestStatus('failed')
      toast.error('Erro ao testar conexão SMTP')
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <span className="text-lg sm:text-xl">Configurações de Email</span>
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
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="smtp-host">Servidor SMTP</Label>
            <Input
              id="smtp-host"
              value={settings.smtpHost}
              onChange={(e) => setSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
              placeholder="smtp.gmail.com"
            />
          </div>
          <div>
            <Label htmlFor="smtp-port">Porta</Label>
            <Input
              id="smtp-port"
              type="number"
              value={settings.smtpPort}
              onChange={(e) => setSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
              placeholder="587"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="smtp-user">Usuário</Label>
          <Input
            id="smtp-user"
            value={settings.smtpUser}
            onChange={(e) => setSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
            placeholder="seu-email@gmail.com"
          />
        </div>

        <div>
          <Label htmlFor="smtp-password">Senha</Label>
          <Input
            id="smtp-password"
            type="password"
            value={settings.smtpPassword}
            onChange={(e) => setSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
            placeholder="Sua senha ou app password"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use-ssl"
            checked={settings.useSsl}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, useSsl: !!checked }))}
          />
          <Label htmlFor="use-ssl">Usar SSL/TLS</Label>
        </div>

        {lastTest && (
          <p className="text-xs text-gray-500">
            Último teste: {lastTest.toLocaleString('pt-BR')}
          </p>
        )}

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button onClick={saveSettings} className="flex-1 w-full sm:w-auto">
            Salvar
          </Button>
          <Button
            variant="outline"
            onClick={testConnection}
            disabled={testing || !settings.smtpHost || !settings.smtpUser}
            className="w-full sm:w-auto"
          >
            <TestTube className="h-4 w-4 mr-1" />
            {testing ? 'Testando...' : 'Testar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
