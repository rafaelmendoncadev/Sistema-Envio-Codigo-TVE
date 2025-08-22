// Qwen Code - Agente Especializado em Documentação e Configuração

export class DocumentationSpecialist {
  name: string;
  expertise: string[];
  
  constructor() {
    this.name = "Documentation Specialist";
    this.expertise = [
      "Technical Documentation",
      "README Creation",
      "Git Configuration",
      "Project Structure",
      "Best Practices"
    ];
  }
  
  async createGitignore(): Promise<string> {
    return `# Dependências do Node.js
node_modules/
.npm/
.npmrc

# Logs
logs/
*.log

# Arquivos de ambiente
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Diretórios de build
.next/
out/
dist/
build/

# Arquivos de banco de dados
*.db
*.sqlite
*.sqlite3

# Arquivos temporários
tmp/
temp/

# Arquivos de configuração do IDE
.vscode/
.idea/
*.swp
*.swo

# Arquivos do sistema operacional
.DS_Store
Thumbs.db

# Prisma
prisma/generated/

# TypeScript
*.tsbuildinfo

# Yarn
.yarn/cache/
.yarn/unplugged/
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# Arquivos de migração do Prisma (se não quiser versionar)
prisma/migrations/
`;
  }
  
  async createReadme(projectDescription: string): Promise<string> {
    return `# Sistema de Códigos de Recarga

## Descrição
${projectDescription}

## Características Principais
- **Upload de Planilhas**: Faça upload de arquivos Excel (.xlsx, .xls) via drag & drop
- **Extração Automática**: Extrai códigos das colunas A e D automaticamente (a partir da linha 3)
- **Grid de Códigos**: Visualização organizada com status visual (disponível/enviado/arquivado)
- **Envios**: Envio de códigos via WhatsApp e Email (simulado)
- **Configurações**: Personalização do formato de saída e configurações de APIs
- **Histórico**: Acompanhamento de todas as ações realizadas
- **Estatísticas**: Métricas de uso e performance

## Tecnologias Utilizadas
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: SQLite/PostgreSQL com Prisma ORM
- **UI Components**: Shadcn/ui, Lucide React Icons
- **Upload**: React Dropzone
- **Processamento**: XLSX para leitura de planilhas

## Pré-requisitos
- Node.js 18 ou superior
- npm ou yarn

## Instalação

1. Clone o repositório:
   \`\`\`bash
   git clone <url-do-repositório>
   \`\`\`

2. Instale as dependências:
   \`\`\`bash
   npm install
   \`\`\`

3. Configure o banco de dados:
   \`\`\`bash
   npx prisma migrate dev --name init
   \`\`\`

4. Inicie o servidor de desenvolvimento:
   \`\`\`bash
   npm run dev
   \`\`\`

## Scripts Disponíveis
- \`npm run dev\`: Inicia o servidor de desenvolvimento
- \`npm run build\`: Compila a aplicação para produção
- \`npm run start\`: Inicia o servidor em modo de produção
- \`npm run lint\`: Executa o linter

## Estrutura do Projeto
\`\`\`
/app
├── app/                 # Páginas Next.js e rotas da API
│   ├── api/             # Rotas da API Next.js
│   ├── configuracoes/   # Página de configurações
│   ├── historico/       # Página de histórico
├── components/          # Componentes React reutilizáveis
├── lib/                 # Utilitários e tipos
├── prisma/              # Schema do Prisma e migrações
├── public/              # Arquivos estáticos
└── scripts/             # Scripts auxiliares
\`\`\`

## Contribuindo
1. Faça um fork do projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## Licença
Este projeto é privado e não está licenciado para uso externo.

## Contato
Seu Nome - seu.email@example.com

Link do Projeto: [https://github.com/seu-usuario/nome-do-projeto](https://github.com/seu-usuario/nome-do-projeto)
`;
  }
}
