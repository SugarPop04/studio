
'use server';

import { type Patient } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { 
  NewPatientFormSchema, 
  type NewPatientFormValues, 
  type CreatePatientActionResult 
} from './schemas';

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
  console.log("Simulating: New patient created:", newPatient);

  // Revalidate paths to attempt to show new data if it were persisted
  revalidatePath("/patients");
  revalidatePath("/dashboard"); // If dashboard shows patient count

  // Return success message and the created patient (simulated)
  return {
    success: `Patient "${newPatient.name}" added successfully (simulated).`,
    patient: newPatient,
  };
}
