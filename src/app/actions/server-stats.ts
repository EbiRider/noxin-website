'use server'

import os from 'os'
import { execSync } from 'child_process'

export type ServerStats = {
  cpuCount: number
  totalRam: number
  freeRam: number
  totalDisk: number
  usedDisk: number
}

export async function getServerStats(): Promise<ServerStats> {
  const cpuCount = os.cpus().length
  const totalRam = os.totalmem()
  const freeRam = os.freemem()

  let totalDisk = 0
  let usedDisk = 0
  try {
    const df = execSync("df -k / | tail -1 | awk '{print $2, $3}'").toString().trim()
    const [total, used] = df.split(' ').map(Number)
    totalDisk = total * 1024
    usedDisk = used * 1024
  } catch { /* non-linux env */ }

  return { cpuCount, totalRam, freeRam, totalDisk, usedDisk }
}
