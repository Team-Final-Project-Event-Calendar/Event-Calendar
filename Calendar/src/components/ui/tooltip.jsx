/**
 * @file Tooltip.jsx
 * @description A React component that wraps Chakra UI's Tooltip to provide additional customization options, such as portal support and arrow visibility.
 */

import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react'
import * as React from 'react'

/**
 * @function Tooltip
 * @description A customizable tooltip component that supports optional portal rendering and arrow display.
 * @param {Object} props - The props passed to the Tooltip component.
 * @param {boolean} [props.showArrow=false] - Whether to display an arrow pointing to the trigger element.
 * @param {React.ReactNode} props.children - The content that triggers the tooltip.
 * @param {boolean} [props.disabled=false] - Whether the tooltip is disabled. If true, the tooltip will not render.
 * @param {boolean} [props.portalled=true] - Whether to render the tooltip inside a portal.
 * @param {React.ReactNode} props.content - The content to display inside the tooltip.
 * @param {Object} [props.contentProps] - Additional props to pass to the tooltip content.
 * @param {React.Ref} [props.portalRef] - A ref to the container where the portal should render.
 * @param {Object} [props.rest] - Additional props passed to the Chakra UI Tooltip component.
 * @param {React.Ref} ref - A forwarded ref for the tooltip content.
 * @returns {JSX.Element} The rendered Tooltip component.
 */
export const Tooltip = React.forwardRef(function Tooltip(props, ref) {
  const {
    showArrow,
    children,
    disabled,
    portalled = true,
    content,
    contentProps,
    portalRef,
    ...rest
  } = props

  if (disabled) return children

  return (
    <ChakraTooltip.Root {...rest}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content ref={ref} {...contentProps}>
            {showArrow && (
              <ChakraTooltip.Arrow>
                <ChakraTooltip.ArrowTip />
              </ChakraTooltip.Arrow>
            )}
            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  )
})
