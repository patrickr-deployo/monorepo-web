export class CustomError extends Error {
  public code: number
  public reason: string
  public message: string
  public wrap: any
  public showType: ErrorShowType = ErrorShowType.ERROR_MESSAGE

  constructor(code: number, reason: string, message: string, wrap?: any) {
    super(message || reason || wrap)
    this.code = code
    this.reason = reason
    this.message = message
    this.wrap = wrap
    Object.setPrototypeOf(this, CustomError.prototype)
  }
}

export enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

export interface ErrorMessage {
  code: number
  message: string
  reason: string
  metadata: any
}

export function isErrorMessage(obj: any): obj is ErrorMessage {
  if (typeof obj === "object" && !Array.isArray(obj) && obj !== null) {
    return "code" in obj && "message" in obj && "reason" in obj
  }
  return false
}
