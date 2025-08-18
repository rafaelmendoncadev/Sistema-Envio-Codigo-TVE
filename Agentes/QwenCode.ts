// Atualização do QwenCode para incluir o novo agente

import { FrontendDeveloper } from './FrontendDeveloper'
import { BackendDeveloper } from './BackendDeveloper'
import { DatabaseSpecialist } from './DatabaseSpecialist'
import { QAEngineer } from './QAEngineer'
import { DevOpsEngineer } from './DevOpsEngineer'
import { UIDesigner } from './UIDesigner'
import { DocumentationSpecialist } from './DocumentationSpecialist'

export class QwenCode {
  name: string;
  role: string;
  team: Array<{
    agent: any;
    name: string;
    expertise: string[];
  }>;
  
  constructor() {
    this.name = "Qwen Code";
    this.role = "Agente Principal de Coordenação";
    
    // Inicializar a equipe de agentes
    this.team = [
      {
        agent: new FrontendDeveloper(),
        name: "Frontend Developer",
        expertise: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
      },
      {
        agent: new BackendDeveloper(),
        name: "Backend Developer",
        expertise: ["Next.js API Routes", "Prisma ORM", "PostgreSQL"]
      },
      {
        agent: new DatabaseSpecialist(),
        name: "Database Specialist",
        expertise: ["PostgreSQL", "Prisma ORM", "Database Design"]
      },
      {
        agent: new QAEngineer(),
        name: "QA Engineer",
        expertise: ["Unit Testing", "Integration Testing", "E2E Testing"]
      },
      {
        agent: new DevOpsEngineer(),
        name: "DevOps Engineer",
        expertise: ["CI/CD", "Deployment", "Infrastructure"]
      },
      {
        agent: new UIDesigner(),
        name: "UI/UX Designer",
        expertise: ["UI Design", "UX Research", "Prototyping"]
      },
      {
        agent: new DocumentationSpecialist(),
        name: "Documentation Specialist",
        expertise: ["Technical Documentation", "README Creation", "Git Configuration"]
      }
    ];
  }
  
  async assignTask(task: string, requirements: string): Promise<string> {
    // Determinar qual agente é mais adequado para a tarefa
    const assignedAgent = this.determineBestAgent(task);
    
    if (!assignedAgent) {
      return `Não foi possível determinar um agente adequado para a tarefa: ${task}`;
    }
    
    // Atribuir a tarefa ao agente selecionado
    switch(assignedAgent.name) {
      case "Frontend Developer":
        if (task.includes("componente")) {
          return await assignedAgent.agent.createComponent(task, requirements);
        } else {
          return await assignedAgent.agent.implementFeature(requirements);
        }
        
      case "Backend Developer":
        if (task.includes("api") || task.includes("endpoint")) {
          const endpointPath = task.split(" ")[task.split(" ").length - 1];
          return await assignedAgent.agent.createApiEndpoint(endpointPath, "GET", requirements);
        } else {
          return await assignedAgent.agent.implementBusinessLogic(requirements);
        }
        
      case "Database Specialist":
        if (task.includes("schema") || task.includes("modelo")) {
          return await assignedAgent.agent.createSchema(requirements);
        } else {
          return await assignedAgent.agent.optimizeQuery(requirements);
        }
        
      case "QA Engineer":
        if (task.includes("teste unitário") || task.includes("componente")) {
          return await assignedAgent.agent.createUnitTest(task, requirements);
        } else {
          return await assignedAgent.agent.createE2ETest(requirements);
        }
        
      case "DevOps Engineer":
        if (task.includes("deploy") || task.includes("deployment")) {
          return await assignedAgent.agent.createDeploymentScript(requirements);
        } else {
          return await assignedAgent.agent.configureCI(requirements);
        }
        
      case "UI/UX Designer":
        if (task.includes("componente")) {
          return await assignedAgent.agent.createComponentDesign(task, requirements);
        } else {
          return await assignedAgent.agent.createUserFlow(requirements);
        }
        
      case "Documentation Specialist":
        if (task.includes("gitignore")) {
          return await assignedAgent.agent.createGitignore();
        } else if (task.includes("readme") || task.includes("documentação")) {
          return await assignedAgent.agent.createReadme(requirements);
        } else {
          return `Agente ${assignedAgent.name} não implementado para esta tarefa.`;
        }
        
      default:
        return `Agente ${assignedAgent.name} não implementado para esta tarefa.`;
    }
  }
  
  private determineBestAgent(task: string) {
    // Lógica simples para determinar o melhor agente com base na tarefa
    const taskLower = task.toLowerCase();
    
    if (taskLower.includes("frontend") || taskLower.includes("componente") || taskLower.includes("interface")) {
      return this.team.find(member => member.name === "Frontend Developer");
    }
    
    if (taskLower.includes("backend") || taskLower.includes("api") || taskLower.includes("endpoint")) {
      return this.team.find(member => member.name === "Backend Developer");
    }
    
    if (taskLower.includes("banco de dados") || taskLower.includes("schema") || taskLower.includes("query")) {
      return this.team.find(member => member.name === "Database Specialist");
    }
    
    if (taskLower.includes("teste") || taskLower.includes("qa")) {
      return this.team.find(member => member.name === "QA Engineer");
    }
    
    if (taskLower.includes("deploy") || taskLower.includes("ci/cd") || taskLower.includes("devops")) {
      return this.team.find(member => member.name === "DevOps Engineer");
    }
    
    if (taskLower.includes("design") || taskLower.includes("ui") || taskLower.includes("ux")) {
      return this.team.find(member => member.name === "UI/UX Designer");
    }
    
    if (taskLower.includes("documentação") || taskLower.includes("readme") || taskLower.includes("gitignore")) {
      return this.team.find(member => member.name === "Documentation Specialist");
    }
    
    // Por padrão, retorna o Frontend Developer para tarefas gerais
    return this.team.find(member => member.name === "Frontend Developer");
  }
}