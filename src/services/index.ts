
import { BlogService } from "./blog";
import { CertificationService } from "./certifications";
import { ConsultationService } from "./consultations";
import { ContactService } from "./contacts";
import { ProjectService } from "./project";
import { ServiceRequestService } from "./service-requests";

// Create service instances
export const blogService = new BlogService();
export const projectService = new ProjectService();
export const contactService = new ContactService();
export const serviceRequestService = new ServiceRequestService();
export const consultationsService = new ConsultationService();
export const certificationService = new CertificationService();

// Export all services
export * from "./blog/types";
export * from "./certifications/types";
export * from "./consultations/types";
export * from "./contacts/types";
export * from "./project/types";
export * from "./service-requests/types";
