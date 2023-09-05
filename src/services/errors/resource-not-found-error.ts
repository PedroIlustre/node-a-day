import { AppError } from "./app-error";

export class ResourceNotFoundError extends AppError {
	constructor() {
		super('Resource Not Found', 400)
	}
}