import { startCronJobs } from '@/server/cron'

export async function GET() {
  startCronJobs()
  return Response.json({ message: 'Cron jobs iniciados.' })
}
