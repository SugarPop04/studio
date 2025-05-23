
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import Link from "next/link";

const metrics = [
  { title: "Total Patients", value: "1,234", icon: <Icons.Patients className="h-6 w-6 text-muted-foreground" /> },
  { title: "Available Doctors", value: "27", icon: <Icons.Doctors className="h-6 w-6 text-muted-foreground" /> },
  { title: "Upcoming Appointments", value: "89", icon: <Icons.Appointments className="h-6 w-6 text-muted-foreground" /> },
  { title: "Rooms Occupied", value: "45/60", icon: <Icons.Dashboard className="h-6 w-6 text-muted-foreground" /> },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8"> {/* Increased gap */}
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"> {/* Increased gap */}
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"> {/* Increased gap */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-border rounded-lg bg-card/50">
              <p className="text-muted-foreground">Recent Activity Chart/List Placeholder</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button variant="outline" asChild>
              <Link href="/patients/new" className="w-full justify-start">
                <Icons.UserPlus className="mr-2 h-4 w-4" />
                New Patient
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/appointments/new" className="w-full justify-start">
                <Icons.CalendarPlus className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Link>
            </Button>
            <Button variant="outline" asChild>
               <Link href="/doctors" className="w-full justify-start">
                <Icons.Doctors className="mr-2 h-4 w-4" />
                View Doctor Directory
               </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
