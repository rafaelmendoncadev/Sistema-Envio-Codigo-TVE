
'use client'

import { useState } from 'react'
import { Book, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

const tutorials = [
  {
    id: 'whatsapp',
    title: 'Como configurar WhatsApp Business API',
    steps: [
      'Acesse o Meta for Developers (developers.facebook.com)',
      'Crie uma nova aplicação e selecione "Business"',
      'Adicione o produto "WhatsApp Business API"',
      'Configure um número de telefone',
      'Copie o Access Token permanente',
      'Copie o Phone Number ID',
      'Cole as informações nas configurações acima'
    ],
    links: [
      { text: 'Meta for Developers', url: 'https://developers.facebook.com' },
      { text: 'Documentação da API', url: 'https://developers.facebook.com/docs/whatsapp' }
    ]
  },
  {
    id: 'email',
    title: 'Como configurar SMTP (Gmail)',
    steps: [
      'Acesse sua conta do Gmail',
      'Vá em Configurações > Ver todas as configurações',
      'Clique na aba "Encaminhamento e POP/IMAP"',
      'Ative o IMAP',
      'Vá em "Gerenciar sua conta do Google"',
      'Ative a verificação em duas etapas',
      'Crie uma "Senha de app" específica',
      'Use gmail.com como servidor e porta 587'
    ],
    links: [
      { text: 'Senhas de app do Google', url: 'https://support.google.com/accounts/answer/185833' }
    ]
  }
]

export function Tutorials() {
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null)

  const toggleTutorial = (id: string) => {
    setExpandedTutorial(expandedTutorial === id ? null : id)
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Book className="h-5 w-5 text-purple-600" />
          <span className="text-lg sm:text-xl">Tutoriais de Configuração</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {tutorials.map((tutorial) => (
          <div key={tutorial.id} className="border rounded-lg">
            <Button
              variant="ghost"
              onClick={() => toggleTutorial(tutorial.id)}
              className="w-full justify-between p-3 sm:p-4 h-auto"
            >
              <span className="font-medium text-left text-sm sm:text-base">{tutorial.title}</span>
              {expandedTutorial === tutorial.id ? (
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              )}
            </Button>
            
            {expandedTutorial === tutorial.id && (
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Passo a passo:</h4>
                  <ol className="text-xs sm:text-sm space-y-1">
                    {tutorial.steps.map((step, index) => (
                      <li key={index} className="flex">
                        <span className="text-blue-600 font-medium mr-2 flex-shrink-0">{index + 1}.</span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Links úteis:</h4>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                    {tutorial.links.map((link, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full sm:w-auto"
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-1"
                        >
                          <span>{link.text}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
