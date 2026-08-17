/**
 * @Author: Ares
 */
import type { UIMessage } from "ai";

export interface LocalSession {
  id: string;
  title: string;
  messages: UIMessage[];
  createdAt: number;
  updatedAt: number;
}
