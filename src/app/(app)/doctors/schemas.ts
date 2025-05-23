
import { z } from 'zod';
import { type Doctor } from '@/lib/data';

export const NewDoctorFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  specialization: z.string().min(3, { message: "Specialization is required." }),
  department: z.string().min(3, { message: "Department is required." }),
  contact: z.string().min(5, { message: "Contact information is required. (e.g., email or phone)" }),
  availabilityDescription: z.string().min(10, {message: "Please provide a brief description of availability."}).optional(),
});

export type NewDoctorFormValues = z.infer<typeof NewDoctorFormSchema>;

export interface CreateDoctorActionResult {
  success?: string;
  error?: string;
  doctor?: Doctor;
  errors?: {
    name?: string[];
    specialization?: string[];
    department?: string[];
    contact?: string[];
    availabilityDescription?: string[];
    _form?: string[];
  };
}
