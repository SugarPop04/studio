
'use server';

import { z } from 'zod';
import { type Patient } from '@/lib/data'; // Assuming Patient type is exported from here
import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation'; // For server-side redirect

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
  contact: z.string().min(5, { message: "Contact information must be at least 5 characters long." }), // Could be email or phone
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

export async function createPatientAction(
  values: NewPatientFormValues
): Promise<CreatePatientActionResult> {
  const validatedFields = NewPatientFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid data. Please check the form fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, age, gender, contact, address, medicalHistory } = validatedFields.data;

  // Simulate ID generation and data creation
  const newId = `P_SIM_${Date.now().toString().slice(-5)}`; // Simulated ID
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NP';

  const newPatient: Patient = {
    id: newId,
    name,
    age,
    gender,
    contact,
    address,
    medicalHistory: medicalHistory || "N/A",
    lastVisit: new Date().toISOString().split('T')[0], // Set lastVisit to today for a new patient
    avatarUrl: `https://placehold.co/100x100.png?text=${initials}`,
  };

  // --- SIMULATED DATA PERSISTENCE ---
  // In a real application, you would save `newPatient` to your database here.
  // For this prototype, this action simulates success but doesn't modify `src/lib/data.ts` persistently.
  console.log("Simulating: New patient created:", newPatient);
  // To make changes visible, data would need to be fetched from a mutable source.

  // Revalidate paths to attempt to show new data if it were persisted
  revalidatePath("/patients");
  revalidatePath("/dashboard"); // If dashboard shows patient count

  // Return success message and the created patient (simulated)
  // Client will handle redirection after showing toast.
  return {
    success: `Patient "${newPatient.name}" added successfully (simulated).`,
    patient: newPatient,
  };
}
