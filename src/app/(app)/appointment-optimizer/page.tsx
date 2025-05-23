"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { suggestAppointmentTimes, type SuggestAppointmentTimesInput, type SuggestAppointmentTimesOutput } from "@/ai/flows/suggest-appointment-times";
import { samplePatientHistory, sampleDoctorAvailability } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  patientHistory: z.string().min(10, "Patient history is too short."),
  doctorAvailability: z.string().min(10, "Doctor availability is too short."),
  patientPreferences: z.string().optional(),
  appointmentType: z.string().min(3, "Appointment type is required."),
  appointmentDuration: z.coerce.number().int().positive("Duration must be a positive number."),
});

type OptimizerFormValues = z.infer<typeof formSchema>;

export default function AppointmentOptimizerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestAppointmentTimesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<OptimizerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientHistory: samplePatientHistory,
      doctorAvailability: sampleDoctorAvailability,
      patientPreferences: "Prefers afternoon appointments if possible.",
      appointmentType: "New Patient Consultation",
      appointmentDuration: 45,
    },
  });

  async function onSubmit(values: OptimizerFormValues) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestAppointmentTimes(values as SuggestAppointmentTimesInput);
      setSuggestions(result);
      toast({
        title: "Suggestions Generated",
        description: "AI has provided optimal appointment times.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to generate appointment suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Icons.Optimizer className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">AI Appointment Optimizer</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Find Optimal Appointment Times</CardTitle>
          <CardDescription>
            Let our AI suggest the best appointment slots based on historical data, doctor availability, and patient preferences to minimize wait times.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="patientHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient History Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter summarized patient history data..." {...field} rows={5} />
                    </FormControl>
                    <FormDescription>
                      Provide historical data on patient appointment timings, duration, and trends.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doctorAvailability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor Availability</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter doctor schedules and availability..." {...field} rows={4} />
                    </FormControl>
                    <FormDescription>
                      Detail the working hours and breaks for the relevant doctor(s).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="patientPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Preferences (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Prefers mornings', 'Not on Fridays'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appointmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'New Patient Check-up'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appointmentDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="pt-6">
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <>
                    <Icons.Clock className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Icons.Optimizer className="mr-2 h-4 w-4" />
                    Get Suggestions
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {suggestions && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-accent-foreground">Suggested Appointment Times</CardTitle> 
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="bg-accent/10 border-accent/50"> 
              <Icons.CalendarPlus className="h-5 w-5 text-accent" />
              <AlertTitle className="text-accent font-semibold">Recommendations</AlertTitle> {/* Made font-semibold */}
              <AlertDescription className="text-accent-foreground/90"> {/* Slightly increased opacity */}
                <p className="font-semibold mb-2">Based on the provided data, here are some optimal times:</p>
                <ul className="list-disc list-inside space-y-1 mb-3">
                  {suggestions.suggestedTimes.map((time, index) => (
                    <li key={index}>{time}</li>
                  ))}
                </ul>
                <p className="font-semibold mt-3 mb-1">Reasoning:</p>
                <p className="text-sm">{suggestions.reasoning}</p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
