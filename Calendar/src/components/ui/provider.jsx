/**
 * @file provider.jsx
 * @description A React component that wraps the application with Chakra UI and custom color mode providers.
 */

'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'

/**
 * @function Provider
 * @description Wraps the application with the `ChakraProvider` for Chakra UI styling and the `ColorModeProvider` for managing color modes.
 * @param {Object} props - The props passed to the `Provider` component.
 * @returns {JSX.Element} The wrapped application with Chakra UI and color mode context.
 */
export function Provider(props) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}