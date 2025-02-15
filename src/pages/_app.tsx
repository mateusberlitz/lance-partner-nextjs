import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, LightMode } from '@chakra-ui/react'
import { theme } from '../styles/theme'
import { ProfileProvider } from '../contexts/useProfile'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
        <LightMode>
            <Component {...pageProps} />
        </LightMode>
    </ChakraProvider>
  )
}

export default MyApp
