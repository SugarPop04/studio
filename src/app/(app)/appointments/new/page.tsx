
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react"; 

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { patientsData, doctorsData, type Patient, type Doctor } from "@/lib/data"; 
import { Separator } from "@/components/ui/separator";

import { createAppointmentAction } from "../actions";
import { NewAppointmentFormSchema, type NewAppointmentFormValues, type CreateAppointmentActionResult } from "../schemas";


const availablePatients: Patient[] = patientsData;
const availableDoctors: Doctor[] = doctorsData;
const appointmentTypes: NewAppointmentFormValues["type"][] = ["Check-up", "Consultation", "Follow-up", "Procedure"];

export default function NewAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const patientIdFromQuery = searchParams.get("patientId");

  const form = useForm<NewAppointmentFormValues>({
    resolver: zodResolver(NewAppointmentFormSchema),
    defaultValues: {
      patientId: patientIdFromQuery || "",
      doctorId: "",
      date: undefined, 
      time: "", 
      type: undefined, 
      notes: "",
    },
  });

  useEffect(() => {
    if (patientIdFromQuery) {
      form.setValue('patientId', patientIdFromQuery);
    }
  }, [patientIdFromQuery, form.setValue]);


  async function onSubmit(values: NewAppointmentFormValues) {
    setIsLoading(true);
    form.clearErrors();

    const result: CreateAppointmentActionResult = await createAppointmentAction(values);
    setIsLoading(false);

    if (result.success && result.appointment) {
      toast({
        title: "Success!",
        description: result.success,
        variant: "default",
      });
      router.push("/appointments");
    } else {
      toast({
        title: "Error Scheduling Appointment",
        description: result.error || "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      });
      if (result.errors) {
        Object.keys(result.errors).forEach((key) => {
          const field = key as keyof NewAppointmentFormValues;
          const message = result.errors?.[field]?.[0];
          if (message) {
            form.setError(field, { type: "server", message });
          }
        });
         if (result.errors._form) {
           form.setError("root.serverError" as any, { type: "custom", message: result.errors._form.join(', ') });
        }
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icons.CalendarPlus className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Schedule New Appointment</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/appointments">
            <Icons.ChevronLeft className="mr-2 h-4 w-4" />
            Back to Appointments
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>Fill in the form to schedule a new appointment.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-foreground/80">Patient & Doctor</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a patient" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availablePatients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.name} (ID: {patient.id})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="doctorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableDoctors.map((doctor) => (
                              <SelectItem key={doctor.id} value={doctor.id}>
                                {doctor.name} ({doctor.specialization})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator className="my-6" />

              <div>
                 <h3 className="text-lg font-medium mb-3 text-foreground/80">Date & Time</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Appointment</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP") 
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setDate(new Date().getDate() - 1)) 
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time (HH:MM 24-hour)</FormLabel>
                        <FormControl>
                          <Input type="time" placeholder="e.g., 14:30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-medium mb-3 text-foreground/80">Appointment Details</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appointment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select appointment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {appointmentTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Patient experiencing mild fever..." {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
               {form.formState.errors.root?.serverError && (
                <FormMessage className="text-destructive">
                  {form.formState.errors.root.serverError.message}
                </FormMessage>
              )}

            </CardContent>
            <CardFooter className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => router.push('/appointments')} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <>
                    <Icons.Clock className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Icons.CalendarPlus className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
