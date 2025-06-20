/**
 * @file toaster.jsx
 * @description A React component and utility for displaying toast notifications using Chakra UI's toaster system.
 */

'use client'

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from '@chakra-ui/react'

/**
 * @constant {Object} toaster
 * @description A toaster instance created using Chakra UI's `createToaster` function.
 * @property {string} placement - The position of the toaster on the screen (e.g., 'bottom-end').
 * @property {boolean} pauseOnPageIdle - Whether to pause the toaster when the page is idle.
 */
export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
})

/**
 * @function Toaster
 * @description A React component that renders a portal-based toaster for displaying toast notifications.
 * @returns {JSX.Element} The rendered Toaster component.
 */
export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast) => (
          <Toast.Root width={{ md: 'sm' }}>
            {toast.type === 'loading' ? (
              <Spinner size='sm' color='blue.solid' />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap='1' flex='1' maxWidth='100%'>
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}