export function startOfDay(d: Date){
  const x = new Date(d)
  x.setHours(0,0,0,0)
  return x
}

export function addDays(d: Date, delta: number){
  const x = new Date(d)
  x.setDate(x.getDate() + delta)
  return x
}

export function formatShort(d: Date){
  return d.toLocaleDateString(undefined, { weekday:'short' }) // lun, mar...
}
