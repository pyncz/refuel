import Document, {
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import type { DocumentProps } from 'next/document'
import i18nextConfig from '../../next-i18next.config'
import { getAbsoluteBaseUrl } from '../utils'

type Props = DocumentProps

class MyDocument extends Document<Props> {
  render() {
    const currentLocale
      = this.props.__NEXT_DATA__.locale
      ?? i18nextConfig.i18n.defaultLocale

    const ogImage = `${getAbsoluteBaseUrl()}/img/cover.jpg`

    return (
      <Html lang={currentLocale}>
        {/* default meta */}
        <Head>
          <meta property="og:site_name" content="refuel" key="og-site_name" />
          <meta property="og:image" content={ogImage} key="og-image" />
          <meta property="twitter:image" content={ogImage} key="twitter-image" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
