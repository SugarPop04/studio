
'use server';

import { revalidatePath } from 'next/cache';
import { doctorsData, type Doctor } from '@/lib/data';
import {
  NewDoctorFormSchema,
  type NewDoctorFormValues,
  type CreateDoctorActionResult
} from './schemas';

export async function createDoctorAction(
  values: NewDoctorFormValues
): Promise<CreateDoctorActionResult> {
  const validatedFields = NewDoctorFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid data. Please check the form fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, specialization, department, contact, availabilityDescription } = validatedFields.data;

  const newId = `D_SIM_${Date.now().toString().slice(-5)}`;
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase() || 'DR';

  // Create a simplified availability structure based on the description.
  // In a real app, this might involve more complex parsing or a structured input.
  const newAvailability = availabilityDescription
    ? [{ day: "Custom", times: [availabilityDescription.substring(0, 50)] }] // Truncate for display
    : [{ day: "Mon-Fri", times: ["9am-5pm (Details TBC)"] }];


  const newDoctor: Doctor = {
    id: newId,
    name,
    specialization,
    department,
    contact,
    availability: newAvailability,
    avatarUrl: `https://placehold.co/100x100.png?text=${initials}`,
  };

  doctorsData.push(newDoctor);
  console.log("Simulating: New doctor added to in-memory store:", newDoctor);

  revalidatePath("/doctors");
  revalidatePath("/dashboard"); // If dashboard shows doctor count or similar

  return {
    success: `Doctor "${newDoctor.name}" added successfully.`,
    doctor: newDoctor,
  };
}
