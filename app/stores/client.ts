import { defineStore } from 'pinia'
import UniversalProvider from '@walletconnect/universal-provider'
import { appMetadata } from '../consts'

export const useClientStore = defineStore('client', () => {
  const config = useRuntimeConfig()

  const {
    state: provider,
    isLoading: isInitializing,
  } = useAsyncState(UniversalProvider.init({
    projectId: config.public.WALLETCONNECT_PROJECT_ID,
    relayUrl: config.public.WALLETCONNECT_RELAY_URL,
    metadata: appMetadata,
  }), null)

  const client = computed(() => provider.value?.client ?? null)

  return {
    client,
    provider,
    isInitializing,
  }
})
