import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { useAccount, useConnect, useNetwork, useSigner, useSwitchNetwork } from 'wagmi'
import i18nextConfig from '../../next-i18next.config'
import { Button, ChainRepresentation, ClientOnly, ConnectionStatus, CreateTaskForm, ErrorMessage, Field, HeadMeta, LogoLink, Select, Spinner } from '../components'
import type { Chain } from '../models'
import { useChains, useGelatoAutomation, useIsMounted } from '../hooks'
import { env } from '../env/client.mjs'

export const getStaticProps: GetStaticProps = async ({
  locale,
}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? i18nextConfig.i18n.defaultLocale, [
        'common',
      ])),
    },
  }
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = () => {
  const { i18n } = useTranslation()

  const chains = useChains()

  const { isConnected } = useAccount()
  const { chain: currentChain } = useNetwork()
  const isMounted = useIsMounted()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()

  const [chainId, setChainId] = useState(currentChain?.id ?? chains[0]?.id)

  const { switchNetwork, isLoading: isSwitchingNetwork } = useSwitchNetwork({
    onSuccess(selectedChain) {
      setChainId(selectedChain.id)
    },
  })

  const changeChain = (newChainId: number) => {
    if (!isConnected) {
      // Not connected yet, just set network to connect
      setChainId(newChainId)
    } else if (switchNetwork) {
      // Connected and the connector provides the switchNetwork method
      switchNetwork(newChainId) // chainId is set onSuccess
    }
  }

  const { data: signer } = useSigner({ chainId })

  const { createTask } = useGelatoAutomation(
    chainId,
    signer,
    env.NEXT_PUBLIC_AUTOMATED_CONTRACT_ADDRESS,
    env.NEXT_PUBLIC_RESOLVER_CONTRACT_ADDRESS,
  )

  return (
    <>
      <HeadMeta
        title={i18n.t('pages.index.title')}
        description={i18n.t('pages.index.description')}
      />

      <div className="tw-flex-center-y tw-flex-col tw-gap-4 tw-justify-between sm:tw-flex-row">
        <LogoLink />
        <div className="sm:tw-h-0 tw-inline-flex tw-w-full sm:tw-w-auto tw-items-center">
          <ConnectionStatus className="tw-w-full" />
        </div>
      </div>

      <div className="sm:tw-flex-1 tw-flex-center tw-flex-col tw-gap-4">
        <div className="tw-space-y-4 tw-rounded-lg sm:tw-rounded-xl tw-bg-dim-1 tw-p-6 sm:tw-p-8 tw-mx-auto tw-w-full tw-max-w-md">
          <ClientOnly>
            <Field
              label={i18n.t('chain')}
              render={id => (
                <Select
                  id={id}
                  value={chainId?.toString()}
                  options={chains}
                  className="tw-w-full"
                  disabled={!isMounted || (isConnected && !switchNetwork) || isSwitchingNetwork}
                  getValue={option => (option as Chain).id.toString()}
                  getTextValue={option => (option as Chain).name}
                  ariaLabel={i18n.t('chain')}
                  renderOption={option => (
                    <ChainRepresentation className="tw-relative tw--left-1" chainId={(option as Chain).id} />
                  )}
                  onChange={newChainId => changeChain(+newChainId)}
                />
              )}
            />
          </ClientOnly>

          <CreateTaskForm chainId={chainId} onSubmit={form => createTask(form)}>
            <div className="tw-space-y-6">
              {error ? <ErrorMessage error={error} /> : null}
              <div className="tw-space-y-2">
                {connectors.map(connector => (
                  <Button
                    appearance="secondary"
                    type="button"
                    className="tw-w-full"
                    disabled={!isMounted || !connector.ready}
                    key={connector.id}
                    iconRight={isLoading && pendingConnector?.id === connector.id
                      ? <Spinner />
                      : null
                  }
                    onClick={() => connect({ connector, chainId })}
                  >
                    {connector.name}
                  </Button>
                ))}
              </div>
            </div>
          </CreateTaskForm>
        </div>
      </div>
    </>
  )
}

export default Home
