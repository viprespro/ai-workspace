export interface ChatSession {
  id: string;
  title: string;
  userId: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface KnowledgeFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: "processing" | "completed" | "failed";
  createdAt: string;
}

export interface AgentTask {
  id: string;
  userId: string;
  type: string;
  status: "pending" | "running" | "success" | "failed";
  input: string;
  output: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  desc: string | null;
}
