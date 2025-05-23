
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { createDoctorAction } from "../actions";
import {
  NewDoctorFormSchema,
  type NewDoctorFormValues,
  type CreateDoctorActionResult
} from "../schemas";
import { Separator } from "@/components/ui/separator";

export default function AddNewDoctorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NewDoctorFormValues>({
    resolver: zodResolver(NewDoctorFormSchema),
    defaultValues: {
      name: "",
      specialization: "",
      department: "",
      contact: "",
      availabilityDescription: "",
    },
  });

  async function onSubmit(values: NewDoctorFormValues) {
    setIsLoading(true);
    form.clearErrors();

    const result: CreateDoctorActionResult = await createDoctorAction(values);

    setIsLoading(false);

    if (result.success && result.doctor) {
      toast({
        title: "Success!",
        description: result.success,
        variant: "default",
      });
      router.push("/doctors");
    } else {
      toast({
        title: "Error Adding Doctor",
        description: result.error || "Failed to add doctor. Please try again.",
        variant: "destructive",
      });
      if (result.errors) {
        Object.keys(result.errors).forEach((key) => {
          const field = key as keyof NewDoctorFormValues;
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
          <Icons.UserPlus className="h-8 w-8 text-primary" /> 
          <h1 className="text-3xl font-bold tracking-tight">Add New Doctor</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/doctors">
            <Icons.ChevronLeft className="mr-2 h-4 w-4" />
            Back to Doctors
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>New Doctor Details</CardTitle>
          <CardDescription>Fill in the form below to add a new doctor to the directory.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
               <div>
                <h3 className="text-lg font-medium mb-3 text-foreground/80">Basic Information</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Dr. Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Cardiology" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Internal Medicine" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-foreground/80">Contact & Availability</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Information</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., dr.smith@example.com or +1234567890" {...field} />
                        </FormControl>
                        <FormDescription>
                          Email address or phone number.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availabilityDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Mon 9am-5pm, Tue 1pm-4pm. Prefers morning appointments." {...field} rows={3}/>
                        </FormControl>
                        <FormDescription>
                          Describe the doctor's general availability. This will be used to set a default schedule.
                        </FormDescription>
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
               <Button type="button" variant="outline" onClick={() => router.push('/doctors')} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <>
                    <Icons.Clock className="mr-2 h-4 w-4 animate-spin" />
                    Adding Doctor...
                  </>
                ) : (
                  <>
                    <Icons.PlusCircle className="mr-2 h-4 w-4" />
                    Add Doctor
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
