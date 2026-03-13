import type { Request, Response } from "express";
import { container } from "tsyringe";
import type { IAuthenticateService } from "../../../domain/services/IAuthenticateService.js";

export class AuthenticateController {
  private service: IAuthenticateService;

  constructor() {
    this.service = container.resolve<IAuthenticateService>("IAuthenticateService");
  }

  async handle(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.service.login(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await this.service.signup(name, email, password);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async confirmSignup(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await this.service.confirmSignup(email);
      return res.status(200).json({ message: "Cadastro confirmado", user });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export const authenticateController = new AuthenticateController();
