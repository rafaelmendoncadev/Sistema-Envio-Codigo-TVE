# Sistema de Códigos de Recarga - Contexto para Qwen Code

## Visão Geral do Projeto

Este é um sistema web completo desenvolvido com Next.js 14 para extração e gerenciamento de códigos de recarga a partir de planilhas Excel. O sistema permite o upload de arquivos Excel (.xlsx, .xls), extrai códigos das colunas A e D (a partir da linha 3) e oferece funcionalidades para visualizar, enviar (simulado) e arquivar esses códigos.

### Características Principais

- **Upload de Planilhas**: Upload via drag & drop de arquivos Excel.
- **Extração Automática**: Extrai códigos das colunas A e D automaticamente.
- **Grid de Códigos**: Visualização em grid com status (disponível/enviado/arquivado).
- **Envios Simulados**: Envio de códigos via WhatsApp e Email (funcionalidades simuladas).
- **Configurações**: Personalização do formato de saída e configurações de APIs.
- **Histórico**: Acompanhamento de todas as ações realizadas.
- **Estatísticas**: Métricas de uso e performance (parcialmente implementado).

### Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: Shadcn/ui, Lucide React Icons
- **Upload**: React Dropzone
- **Processamento**: XLSX para leitura de planilhas
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Gerenciamento de Estado**: Zustand, Jotai (potencialmente)
- **Validação**: Zod, Yup

### Estrutura de Pastas

```
/app
├── app/                 # Páginas Next.js e rotas da API
│   ├── api/             # Rotas da API Next.js
│   ├── configuracoes/   # Página de configurações
│   ├── historico/       # Página de histórico
│   ├── layout.tsx       # Layout raiz da aplicação
│   ├── page.tsx         # Página principal
├── components/          # Componentes React reutilizáveis
│   ├── ui/              # Componentes UI (Shadcn)
│   ├── codes-grid.tsx   # Componente para exibir os códigos
│   ├── upload-area.tsx  # Componente para upload de arquivos
│   └── ...              # Outros componentes
├── lib/                 # Utilitários, tipos e funções auxiliares
├── prisma/              # Schema do Prisma e configurações do banco de dados
├── public/              # Arquivos estáticos
└── ...                  # Arquivos de configuração (package.json, tsconfig.json, etc.)
```

## Comandos de Desenvolvimento

- `npm run dev`: Inicia o servidor de desenvolvimento Next.js.
- `npm run build`: Compila a aplicação Next.js para produção.
- `npm run start`: Inicia o servidor Next.js em modo de produção.
- `npm run lint`: Executa o linter (ESLint) no código.

## Convenções de Desenvolvimento

- **Componentes**: Componentes React são criados como arquivos `.tsx` na pasta `components/`. Componentes UI reutilizáveis são colocados em `components/ui/`.
- **Páginas**: Páginas Next.js são criadas como arquivos `page.tsx` dentro de diretórios em `app/`.
- **Rotas da API**: Rotas da API Next.js são criadas como arquivos `route.ts` dentro de diretórios `app/api/`.
- **Tipos**: Tipos TypeScript são definidos em `lib/types.ts`.
- **Estados**: Gerenciamento de estado local com hooks React. Para estados globais, bibliotecas como Zustand ou Jotai podem ser utilizadas.
- **Estilização**: Tailwind CSS é usado para estilização. Componentes Shadcn/ui são utilizados para a interface.

## Observações Importantes

- **Sem Autenticação**: O sistema foi desenvolvido sem sistema de autenticação/login, conforme especificado.
- **APIs Simuladas**: Os envios de WhatsApp e Email são simulados para fins de demonstração.
- **Banco de Dados**: Utiliza PostgreSQL com Prisma ORM. O schema está definido em `prisma/schema.prisma`.