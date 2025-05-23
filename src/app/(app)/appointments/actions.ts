
'use server';

import { revalidatePath } from 'next/cache';
import { appointmentsData, patientsData, doctorsData, type Appointment } from '@/lib/data';
import { 
  NewAppointmentFormSchema, 
  type NewAppointmentFormValues, 
  type CreateAppointmentActionResult 
} from './schemas';

export async function createAppointmentAction(
  values: NewAppointmentFormValues
): Promise<CreateAppointmentActionResult> {
  const validatedFields = NewAppointmentFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid data. Please check the form fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { patientId, doctorId, date, time, type, notes } = validatedFields.data;

  const patient = patientsData.find(p => p.id === patientId);
  const doctor = doctorsData.find(d => d.id === doctorId);

  if (!patient) {
    return { error: "Selected patient not found." };
  }
  if (!doctor) {
    return { error: "Selected doctor not found." };
  }

  const newId = `A_SIM_${Date.now().toString().slice(-5)}`; // Simulated ID

  // Convert time from HH:MM (24h) to AM/PM format for display consistency if needed,
  // or store as HH:MM and format on display. Storing as HH:MM is simpler.
  // For this example, we'll store as provided.
  // To convert to AM/PM for display:
  const [hours, minutes] = time.split(':');
  const numericHours = parseInt(hours, 10);
  const ampm = numericHours >= 12 ? 'PM' : 'AM';
  const displayHours = numericHours % 12 || 12; // Convert 0 or 12 to 12
  const displayTime = `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;


  const newAppointment: Appointment = {
    id: newId,
    patientId,
    patientName: patient.name,
    doctorId,
    doctorName: doctor.name,
    date: date.toISOString().split('T')[0], // Store date as YYYY-MM-DD
    time: displayTime, // Store in AM/PM format as per existing data
    type,
    status: "Scheduled", // New appointments are scheduled by default
    notes: notes || "",
  };

  appointmentsData.push(newAppointment);
  console.log("Simulating: New appointment added to in-memory store:", newAppointment);
  console.log("Current appointmentsData:", appointmentsData.length);


  revalidatePath("/appointments");
  revalidatePath("/dashboard"); // If dashboard shows appointment count

  return {
    success: `Appointment for ${patient.name} with ${doctor.name} on ${newAppointment.date} at ${newAppointment.time} scheduled successfully.`,
    appointment: newAppointment,
  };
}
