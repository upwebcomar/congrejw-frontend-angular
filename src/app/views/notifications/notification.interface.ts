export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timeout?: number; // Opcional para auto-eliminar
  createdAt?:Date
  userId:number
}