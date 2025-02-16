export function getStartAndEndOfWeek(): { startOfWeek: Date; endOfWeek: Date } {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 (domingo) a 6 (sábado)
  const startOfWeek = new Date(now) // Clona a data atual
  startOfWeek.setDate(now.getDate() - dayOfWeek) // Volta ao domingo da semana atual
  startOfWeek.setHours(0, 0, 0, 0) // Define o horário para o início do dia

  const endOfWeek = new Date(now) // Clona a data atual
  endOfWeek.setHours(23, 59, 59, 999) // Define o horário para o final do dia

  return { startOfWeek, endOfWeek }
}
