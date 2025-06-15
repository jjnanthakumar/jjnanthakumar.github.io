export interface ContactForm {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export type Contact = {
	id: string;
	name: string;
	email: string;
	subject: string;
	message: string;
	status: "new" | "read" | "replied" | "archived";
	createdAt: Date;
};
