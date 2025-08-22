import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'yup';

export const validate = (schema: AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
};