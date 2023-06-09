import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { useAccount, useConnect, useNetwork, useSigner, useSwitchNetwork } from 'wagmi'
import classNames from 'classnames'
import i18nextConfig from '../../next-i18next.config'
import { Button, Card, ChainRepresentation, ClientOnly, ConnectionStatus, CreateTaskForm, ErrorMessage, Field, GelatoTask, HeadMeta, LogoLink, Select, Spinner } from '../components'
import type { Chain, Task } from '../models'
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

  const { automate, createTask } = useGelatoAutomation(
    currentChain?.id,
    signer,
    env.NEXT_PUBLIC_AUTOMATED_CONTRACT_ADDRESS,
    env.NEXT_PUBLIC_RESOLVER_CONTRACT_ADDRESS,
  )

  const [activeTasks, setActiveTasks] = useState<Task[]>()
  useEffect(() => {
    const fetchData = async () => {
      if (automate) {
        setActiveTasks(await automate.getActiveTasks())
      }
    }
    fetchData()
  }, [automate])

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

      <div className="sm:tw-flex-1 tw-flex-center tw-flex-col tw-gap-4 tw-w-full tw-max-w-md tw-mx-auto">
        <Card className={classNames(
          'tw-space-y-6',
          'after:tw-mask-to-20 after:tw-mask-radial after:tw-mask-at-t after:tw-mask-reach-cover',
          'before:tw-blur-md before:tw-z-muted before:tw-absolute before:tw-inset-0 before:tw-bg-[radial-gradient(50%_50%_at_50%_70%,_rgba(var(--accent-primary),_0.4),_rgba(var(--accent-primary),_0))]',
        )}
        >
          <ClientOnly>
            <Field
              render={id => (
                <Select
                  className="tw-relative tw--left-0.5"
                  id={id}
                  value={chainId?.toString()}
                  options={chains}
                  disabled={!isMounted || (isConnected && !switchNetwork) || isSwitchingNetwork}
                  getValue={option => (option as Chain).id.toString()}
                  getTextValue={option => (option as Chain).name}
                  ariaLabel={i18n.t('chain')}
                  renderOption={option => (
                    <ChainRepresentation chainId={(option as Chain).id} />
                  )}
                  onChange={newChainId => changeChain(+newChainId)}
                />
              )}
            />
          </ClientOnly>

          <CreateTaskForm
            chainId={chainId}
            onSubmit={async (form) => {
              await createTask(form)
            }}
          >
            <div className="tw-space-y-6">
              {error ? <ErrorMessage error={error} /> : null}
              <ClientOnly>
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
              </ClientOnly>
            </div>
          </CreateTaskForm>
        </Card>

        {activeTasks?.length
          ? (
            <div className="tw-space-y-2 tw-w-full">
              <h6 className="tw-mt-2 tw-text-dim-3 tw-uppercase">{i18n.t('activeTasks')}</h6>
              <div className="tw-space-y-4">
                {activeTasks?.map(task => (
                  <GelatoTask key={task.taskId} {...task} chainId={currentChain?.id} />
                )) ?? null}
              </div>
            </div>
            )
          : null
        }
      </div>
    </>
  )
}

export default Home
