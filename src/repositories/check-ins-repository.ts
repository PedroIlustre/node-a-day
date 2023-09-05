import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
	create(data: Prisma.CheckInUncheckedUpdateInput): Promise<CheckIn>
	// findByEmail(email: string): Promise<User | null>
	// findById(id: string): Promise<User | null>
}