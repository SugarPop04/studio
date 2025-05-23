import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

const metrics = [
  { title: "Total Patients", value: "1,234", icon: <Icons.Patients className="h-6 w-6 text-muted-foreground" /> },
  { title: "Available Doctors", value: "27", icon: <Icons.Doctors className="h-6 w-6 text-muted-foreground" /> },
  { title: "Upcoming Appointments", value: "89", icon: <Icons.Appointments className="h-6 w-6 text-muted-foreground" /> },
  { title: "Rooms Occupied", value: "45/60", icon: <Icons.Dashboard className="h-6 w-6 text-muted-foreground" /> },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Placeholder for recent activity chart or list */}
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Recent Activity Chart/List Placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <button className="w-full justify-start p-2 text-left hover:bg-accent rounded-md transition-colors">New Patient</button>
            <button className="w-full justify-start p-2 text-left hover:bg-accent rounded-md transition-colors">Schedule Appointment</button>
            <button className="w-full justify-start p-2 text-left hover:bg-accent rounded-md transition-colors">View Doctor Schedule</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
