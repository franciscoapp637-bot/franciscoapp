export interface ServiceItem {
  description: string;
  laborCost: number;
  partsCost: number;
}

export interface Certificate {
  id?: string;
  userId: string;
  certificateNumber: string;
  clientName: string;
  motoModel: string;
  motoPlate?: string;
  motoMileage: string;
  laborValue: number;
  partsValue: number;
  totalValue: number;
  services: ServiceItem[];
  observations: string;
  photoUrls: string[];
  pdfUrl?: string;
  createdAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}
