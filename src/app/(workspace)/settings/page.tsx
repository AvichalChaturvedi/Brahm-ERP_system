import { Card, Heading, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <Heading title="Settings & Workspace" />
      <Tabs defaultValue="security">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="security" className="mt-4">
          <Card>
            <h3 className="font-semibold text-primary">Hardware IP Protection</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
              <li>NDA enforcement automation enabled</li>
              <li>Watermarking on all design exports</li>
              <li>Encryption access logs with immutable audit trail</li>
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}