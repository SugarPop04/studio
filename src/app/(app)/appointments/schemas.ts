
import { z } from 'zod';
import { type Appointment } from '@/lib/data';

export const NewAppointmentFormSchema = z.object({
  patientId: z.string().min(1, { message: "Patient selection is required." }),
  doctorId: z.string().min(1, { message: "Doctor selection is required." }),
  date: z.date({
    required_error: "Appointment date is required.",
    invalid_type_error: "That's not a valid date!",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format. Use HH:MM (24-hour)."}),
  type: z.enum(["Check-up", "Consultation", "Follow-up", "Procedure"], {
    required_error: "Appointment type is required.",
  }),
  notes: z.string().optional(),
});

export type NewAppointmentFormValues = z.infer<typeof NewAppointmentFormSchema>;

export interface CreateAppointmentActionResult {
  success?: string;
  error?: string;
  appointment?: Appointment; // Return the created appointment (simulated)
  errors?: {
    patientId?: string[];
    doctorId?: string[];
    date?: string[];
    time?: string[];
    type?: string[];
    notes?: string[];
    _form?: string[];
  };
}
