import { ValidationError } from '@/shared/services/apiClient'
import { hasSupportErrors, validateSupportDraft } from '../lib/supportValidation'
import type { SupportDraft, SupportSubmitRequest } from '../types'
import { resolveSupportGateway } from './supportGatewayFactory'

/** Fachada del módulo: valida antes de enviar y aísla a los hooks del adaptador. */
const gateway = resolveSupportGateway()

function toIssues(errors: ReturnType<typeof validateSupportDraft>): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(errors).map(([field, message]) => [field, message ? [message] : []]),
  )
}

export const supportService = {
  async submit(draft: SupportDraft) {
    const errors = validateSupportDraft(draft)
    if (hasSupportErrors(errors)) throw new ValidationError(toIssues(errors))
    if (!draft.topic) throw new ValidationError(toIssues(errors))

    const request: SupportSubmitRequest = {
      email: draft.email.trim(),
      topic: draft.topic,
      subject: draft.subject.trim(),
      description: draft.description.trim(),
      source: 'web',
    }
    return gateway.submit(request)
  },
}
