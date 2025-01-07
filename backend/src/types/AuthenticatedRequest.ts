import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Define the shape of the user object
}