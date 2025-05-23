
import { appointmentsData, type Appointment } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";

async function getAppointments(): Promise<Appointment[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return appointmentsData;
}

function getStatusBadgeVariant(status: Appointment['status']): "default" | "accent" | "destructive" | "outline" {
  switch (status) {
    case "Scheduled":
      return "default"; // primary color
    case "Completed":
      return "accent"; // Use accent (green) for completed
    case "Cancelled":
      return "destructive";
    case "Pending":
      return "outline";
    default:
      return "outline";
  }
}


export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <div className="flex gap-2">
            <Link href="/appointment-optimizer">
            <Button variant="outline">
                <Icons.Optimizer className="mr-2 h-4 w-4" />
                AI Optimizer
            </Button>
            </Link>
            <Link href="/appointments/new"> 
            <Button>
                <Icons.CalendarPlus className="mr-2 h-4 w-4" />
                Schedule New
            </Button>
            </Link>
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList className="grid w-full grid-cols-2 md:w-1/3">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Manage all scheduled appointments.</CardDescription>
              <div className="pt-4 relative">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 transform mt-[9px] h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by patient, doctor, or type..." className="max-w-sm pl-10" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium">{apt.patientName}</TableCell>
                      <TableCell>{apt.doctorName}</TableCell>
                      <TableCell>{new Date(apt.date).toLocaleDateString()}</TableCell>
                      <TableCell>{apt.time}</TableCell>
                      <TableCell>{apt.type}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(apt.status)}>{apt.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <Icons.MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Icons.View className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Icons.Edit className="mr-2 h-4 w-4" /> Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive hover:!text-destructive-foreground focus:!text-destructive-foreground hover:!bg-destructive/90 focus:!bg-destructive/90">
                              <Icons.Trash2 className="mr-2 h-4 w-4" /> Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Visualize appointments on a calendar.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-4">
              <Calendar
                mode="single"
                selected={new Date()} 
                className="rounded-md border" 
              />
            </CardContent>
             <CardContent className="text-center text-muted-foreground pb-6">
                Full calendar functionality to be implemented.
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
