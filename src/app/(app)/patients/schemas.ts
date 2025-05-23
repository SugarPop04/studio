
import { z } from 'zod';
import { type Patient } from '@/lib/data';

// Schema for new patient form validation
export const NewPatientFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  age: z.coerce
    .number({ invalid_type_error: "Age must be a number." })
    .int("Age must be an integer.")
    .positive("Age must be a positive number.")
    .max(120, { message: "Age seems too high. Please enter a valid age." }),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required.",
    invalid_type_error: "Please select a valid gender."
  }),
  contact: z.string().min(5, { message: "Contact information must be at least 5 characters long." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters long." }),
  medicalHistory: z.string().optional(),
});

export type NewPatientFormValues = z.infer<typeof NewPatientFormSchema>;

export interface CreatePatientActionResult {
  success?: string;
  error?: string;
  patient?: Patient;
  errors?: {
    name?: string[];
    age?: string[];
    gender?: string[];
    contact?: string[];
    address?: string[];
    medicalHistory?: string[];
    _form?: string[]; // For general form errors
  };
}
