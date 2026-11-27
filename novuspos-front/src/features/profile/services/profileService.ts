import type { AuthUser } from '@/shared/lib/auth-types'
import { apiClient } from '@/shared/services/apiClient'
import { AUTH_ENDPOINTS } from '@/shared/services/endpoints'

export interface UpdateProfileRequest {
  name: string
  organization_name: string
  business_sector: string | null
}

export const profileService = {
  async updateProfile(data: UpdateProfileRequest): Promise<AuthUser> {
    const response = await apiClient.put<{ user: AuthUser }>(AUTH_ENDPOINTS.profile, data)
    return response.user
  },

  async sendEmailVerification(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(AUTH_ENDPOINTS.sendEmailVerification)
  },
}
