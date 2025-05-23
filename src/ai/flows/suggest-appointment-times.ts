// This file uses server-side code.
'use server';

/**
 * @fileOverview An AI agent for suggesting optimal appointment times based on
 * historical data and doctor availability.
 *
 * - suggestAppointmentTimes - A function that suggests appointment times.
 * - SuggestAppointmentTimesInput - The input type for the
 *   suggestAppointmentTimes function.
 * - SuggestAppointmentTimesOutput - The return type for the
 *   suggestAppointmentTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAppointmentTimesInputSchema = z.object({
  patientHistory: z
    .string()
    .describe(
      'Historical data of patient appointments, including duration, time of day, and day of week.'
    ),
  doctorAvailability: z
    .string()
    .describe('The availability schedule of the doctor.'),
  patientPreferences: z
    .string()
    .optional()
    .describe('Any preferences the patient has for appointment times.'),
  appointmentType: z.string().describe('The type of appointment.'),
  appointmentDuration: z.number().describe('The duration of the appointment in minutes.'),
});

export type SuggestAppointmentTimesInput = z.infer<
  typeof SuggestAppointmentTimesInputSchema
>;

const SuggestAppointmentTimesOutputSchema = z.object({
  suggestedTimes: z
    .array(z.string())
    .describe(
      'A list of suggested appointment times, taking into account historical data, doctor availability, and patient preferences.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested appointment times, including how historical data and doctor availability were taken into account.'
    ),
});

export type SuggestAppointmentTimesOutput = z.infer<
  typeof SuggestAppointmentTimesOutputSchema
>;

export async function suggestAppointmentTimes(
  input: SuggestAppointmentTimesInput
): Promise<SuggestAppointmentTimesOutput> {
  return suggestAppointmentTimesFlow(input);
}

const suggestAppointmentTimesPrompt = ai.definePrompt({
  name: 'suggestAppointmentTimesPrompt',
  input: {schema: SuggestAppointmentTimesInputSchema},
  output: {schema: SuggestAppointmentTimesOutputSchema},
  prompt: `You are an AI assistant that suggests optimal appointment times for new patients based on historical data, doctor availability, and patient preferences.

  Consider the following information:
  Patient History: {{{patientHistory}}}
  Doctor Availability: {{{doctorAvailability}}}
  Patient Preferences: {{{patientPreferences}}}
  Appointment Type: {{{appointmentType}}}
  Appointment Duration: {{{appointmentDuration}}} minutes

  Based on this information, suggest a list of optimal appointment times and explain your reasoning.
  Format the output as a JSON object with 'suggestedTimes' (an array of times) and 'reasoning' fields.`,
});

const suggestAppointmentTimesFlow = ai.defineFlow(
  {
    name: 'suggestAppointmentTimesFlow',
    inputSchema: SuggestAppointmentTimesInputSchema,
    outputSchema: SuggestAppointmentTimesOutputSchema,
  },
  async input => {
    const {output} = await suggestAppointmentTimesPrompt(input);
    return output!;
  }
);
