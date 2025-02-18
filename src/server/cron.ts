import { sendWeeklyNotifications } from '@/app/server-action/sendNotifications'
import cron from 'node-cron'

export function startCronJobs() {
  const job = cron.schedule('* * * * *', async () => {
    console.log('Enviando notificações semanais...')
    const result = await sendWeeklyNotifications()
    console.log(result.message)

    job.stop()
  })
}
