
export interface UploadSession {
  id: string;
  filename: string;
  totalCodes: number;
  validCodes: number;
  createdAt: Date;
}

export interface Code {
  id: string;
  sessionId: string;
  columnAValue: string | null;
  columnDValue: string | null;
  combinedCode: string;
  rowNumber: number;
  status: 'available' | 'sent' | 'archived';
  sentAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
}

export interface HistoryItem {
  id: string;
  codeId: string | null;
  actionType: 'send_whatsapp' | 'send_email' | 'archive' | 'unarchive';
  destination: string | null;
  status: 'success' | 'failed' | 'pending';
  details: string | null;
  createdAt: Date;
}

export interface ApiSetting {
  id: string;
  serviceType: 'whatsapp' | 'email';
  encryptedConfig: string;
  isActive: boolean;
  lastTested: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  webhookUrl?: string;
}

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  useSsl?: boolean;
}
