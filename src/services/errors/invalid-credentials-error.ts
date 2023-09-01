import { AppError } from "./app-error";

export class InvalidCredentialsError extends AppError {
	constructor() {
		super('Invalid Credentials', 409)
	}
}