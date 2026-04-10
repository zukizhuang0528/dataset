import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPlaceholderPage({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className='flex flex-1 flex-col gap-6'>
      <Card className='surface-brand-glow overflow-hidden border-primary/10 shadow-lg'>
        <CardHeader className='gap-4'>
          <div className='space-y-3'>
            <Badge
              variant='outline'
              className='border-primary/20 bg-background/80 text-primary rounded-full px-3 py-1'
            >
              {eyebrow}
            </Badge>
            <CardTitle className='text-4xl leading-tight font-semibold tracking-tight'>
              {title}
            </CardTitle>
            <CardDescription className='max-w-2xl text-sm leading-7 md:text-base'>
              {description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className='grid gap-4 md:grid-cols-3'>
        {[
          { label: 'Module status', value: 'Scaffolded' },
          { label: 'Navigation state', value: 'Ready' },
          { label: 'Role scope', value: 'Super admin' }
        ].map((item) => (
          <Card key={item.label} className='border-border/80 shadow-md'>
            <CardHeader className='pb-2'>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className='text-2xl font-semibold'>{item.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className='border-border/80 shadow-md'>
        <CardHeader>
          <CardTitle>Next step</CardTitle>
          <CardDescription>
            This page is prepared as a dedicated module entry so we can continue expanding the
            super-admin information architecture without breaking the sidebar structure.
          </CardDescription>
        </CardHeader>
        <CardContent className='text-muted-foreground text-sm leading-7'>
          We can now continue replacing this placeholder with the real page content while keeping
          the fixed admin navigation intact.
        </CardContent>
      </Card>
    </div>
  );
}
