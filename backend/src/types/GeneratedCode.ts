export interface GeneratedCode {
  id: string;
  userId: string;
  code: string;
  createdAt: Date;
  prompt: string;
}

export interface GenerateOptions {
  language: string;
  [key: string]: any;
}
