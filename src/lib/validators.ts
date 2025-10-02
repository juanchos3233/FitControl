export function isEmail(value: string){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim().toLowerCase())
}

export function isStrongPassword(value: string){
  // >=8, 1 mayúscula, 1 minúscula, 1 dígito
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)
}

export function isName(value: string){
  const v = value.trim()
  return v.length >= 2 && v.length <= 50 && !/\d/.test(v)
}

export function isNonEmpty(value: string){
  return value.trim().length > 0 && value.trim().length <= 120
}
