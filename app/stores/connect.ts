import { defineStore, storeToRefs } from 'pinia'
import { Web3Modal } from '@web3modal/standalone'
import type { SessionTypes } from '@walletconnect/types'
import { SessionUpdate, allowedMethods } from '../consts'
import { useClientStore } from './client'

export const useConnectStore = defineStore('connect', () => {
  const { provider, isInitializing } = storeToRefs(useClientStore())

  const config = useRuntimeConfig()

  const web3Modal = new Web3Modal({
    walletConnectVersion: 2,
    projectId: config.public.WALLETCONNECT_PROJECT_ID,
  })

  // Current connection state
  const session = ref<SessionTypes.Struct | null>(null)
  const accounts = ref<string[] | null>(null)
  const chain = ref<string | null>(null)

  const isConnected = computed(() => !!session.value)
  const isConnecting = ref(false)

  /**
   * Reset the connection state
   */
  const reset = () => {
    session.value = null
    accounts.value = null
    chain.value = null
    isConnecting.value = false
  }

  // Whenever client is initialized, set up listeners
  whenever(provider, (uniProvider) => {
    uniProvider.on('display_uri', async (uri: string) => {
      web3Modal.openModal({
        uri,
        standaloneChains: config.public.chains,
      })
    })

    uniProvider.client.on('session_event', ({ topic, params }) => {
      // Handle session events, such as "chainChanged", "accountsChanged", etc.
      console.log('session_event', topic, params)

      if (session.value) {
        switch (params.event.name) {
          case SessionUpdate.CHAIN:
            chain.value = (params.event.data as string) ?? params.chainId
            break
          case SessionUpdate.ACCOUNTS:
            accounts.value = params.event.data as string[]
        }
      }
    })

    uniProvider.client.on('session_update', ({ topic, params }) => {
      console.log('session_update', topic, params)

      if (session.value) {
        const { namespaces } = params
        const _session = uniProvider.client.session.get(topic)
        // Overwrite the `namespaces` of the existing session with the incoming one.
        session.value = {
          ..._session,
          namespaces,
        }
      }
    })

    uniProvider.client.on('session_delete', () => {
      reset()
    })
  }, { immediate: true })

  // Whenever client is initialized, try to restore the session
  whenever(provider, async (uniProvider) => {
    // populate (the last) existing session
    if (uniProvider.session) {
      const allNamespaceAccounts = Object.values(uniProvider.session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat()
      const [namespaceKey, chainKey, _address] = allNamespaceAccounts[0].split(':')
      const restoredChain = `${namespaceKey}:${chainKey}`

      session.value = uniProvider.session
      accounts.value = allNamespaceAccounts.map((account) => account.split(':')[2])
      chain.value = restoredChain

      console.log('Session restored', uniProvider.session)
    }
  }, { immediate: true })

  /**
   * Connect account with the provided chain
   */
  const connect = async (chainToConnect?: string) => {
    if (!provider.value) {
      if (isInitializing.value) {
        // Still initializing, try next time...
        isConnecting.value = true
        setTimeout(() => connect(chainToConnect), 1000)
      } else {
        // Failed to initialize, abort
        isConnecting.value = false
      }

      return
    }

    // Otherwise, start connecting process
    isConnecting.value = true

    session.value = await provider.value.connect({
      // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
      namespaces: {
        eip155: {
          methods: allowedMethods,
          chains: chainToConnect ? [chainToConnect] : config.public.chains,
          events: Object.values(SessionUpdate),
        },
      },
    }) ?? null

    accounts.value = await provider.value.enable()
    chain.value = chainToConnect ?? config.public.chains[0]
    web3Modal.closeModal()

    isConnecting.value = false
  }

  /**
   * Disconnect account
   */
  const disconnect = async () => {
    await provider.value?.disconnect()
    reset()
  }

  return {
    connect,
    disconnect,

    isConnected,
    isConnecting,
    ...toRefs(session),
  }
})

