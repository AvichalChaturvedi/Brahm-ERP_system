import { Card, Heading } from '@/components/ui';

export default function ContactSalesPage() {
  return (
    <div className="space-y-4">
      <Heading title="Contact Sales" />
      <Card>
        <p className="text-sm">Phone: +91-80-0000-0000</p>
        <p className="text-sm">Email: sales@brahmworks.com</p>
        <p className="text-sm">Headquarters: BrahmWorks, Yeshwanthpur, Bengaluru, India</p>
      </Card>
    </div>
  );
}