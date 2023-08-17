import { AppError } from "./app-error";
export class UserAlreadyExistsError extends AppError {
	constructor() {
		super('Email already exists', 409)
	}
}