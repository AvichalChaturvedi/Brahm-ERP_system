import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { PageHeader } from '@/components/premium';

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Data Security & IP Protection" sub="Policy controls, encryption posture, and traceable access governance." />
      <Tabs defaultValue="security">
        <TabsList>
          <TabsTrigger value="profile">User Profile & Identity</TabsTrigger>
          <TabsTrigger value="workspace">Organizational Configuration</TabsTrigger>
          <TabsTrigger value="notifications">Alert Configuration</TabsTrigger>
          <TabsTrigger value="security">Data Security & IP Protection</TabsTrigger>
          <TabsTrigger value="developer">System Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <Card>
            <p className="text-sm text-ink-muted">Manage identity attributes, role mapping, and account governance controls.</p>
            <button className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">Apply Changes</button>
          </Card>
        </TabsContent>
        <TabsContent value="workspace" className="mt-4">
          <Card>
            <p className="text-sm text-ink-muted">Configure business units, program defaults, and operational policy templates.</p>
            <button className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">Apply Changes</button>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <p className="text-sm text-ink-muted">Configure escalation alerts for supply risk, timeline drift, and reliability thresholds.</p>
            <button className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">Apply Changes</button>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="mt-4">
          <Card>
            <h3 className="font-semibold text-primary">Hardware IP Protection</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-ink-soft">
              <li>AES-256 encryption applied to all design artifacts</li>
              <li>Access to design assets gated by digitally executed NDAs</li>
              <li>Embedded trace identifiers in distributed files</li>
              <li>Full traceability of file access and user actions</li>
            </ul>
            <div className="mt-4 rounded-xl border border-border bg-surfaceMuted p-3 text-xs text-ink-muted">Audit Log: 145 secured access events this month.</div>
            <button className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">Apply Changes</button>
          </Card>
        </TabsContent>
        <TabsContent value="developer" className="mt-4">
          <Card>
            <p className="text-sm text-ink-muted">Configure API integrations, automation hooks, and controlled environment variables.</p>
            <button className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">Apply Changes</button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}