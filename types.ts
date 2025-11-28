export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}

export type ViewMode = 'list' | 'calendar';
export type EditorMode = 'edit' | 'preview';