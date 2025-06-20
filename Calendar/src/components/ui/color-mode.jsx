/**
 * @file color-mode.jsx
 * @description Provides utilities for managing and toggling color modes (light/dark) in a React application using the `next-themes` library.
 */

"use client";

import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react";
import { ThemeProvider, useTheme } from "next-themes";
import * as React from "react";
import { LuMoon, LuSun } from "react-icons/lu";

/**
 * @function ColorModeProvider
 * @description Wraps the application with a theme provider to enable color mode management.
 * @param {Object} props - The props passed to the `ThemeProvider`.
 * @returns {JSX.Element} The `ThemeProvider` component.
 */
export function ColorModeProvider(props) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

/**
 * @function useColorMode
 * @description A custom hook to manage and toggle the application's color mode.
 * @returns {Object} An object containing:
 * - `colorMode` (string): The current color mode ("light" or "dark").
 * - `setColorMode` (Function): A function to manually set the color mode.
 * - `toggleColorMode` (Function): A function to toggle between light and dark modes.
 */
export function useColorMode() {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme();
  const colorMode = forcedTheme || resolvedTheme;
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return {
    colorMode: colorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

/**
 * @function useColorModeValue
 * @description A custom hook to return a value based on the current color mode.
 * @param {any} light - The value to return when the color mode is "light".
 * @param {any} dark - The value to return when the color mode is "dark".
 * @returns {any} The value corresponding to the current color mode.
 */
export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

/**
 * @function ColorModeIcon
 * @description A React component that renders an icon based on the current color mode.
 * @returns {JSX.Element} The moon icon (`<LuMoon />`) for dark mode or the sun icon (`<LuSun />`) for light mode.
 */
export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? <LuMoon /> : <LuSun />;
}
/**
 * @function ColorModeButton
 * @description A React component that renders a button to toggle the application's color mode (light/dark).
 * This component uses `React.forwardRef` to allow refs to be passed to the button.
 * @param {Object} props - The props passed to the button component.
 * @param {React.Ref} ref - A ref forwarded to the button element.
 * @returns {JSX.Element} The rendered button component.
 */
export const ColorModeButton = React.forwardRef(function ColorModeButton(
  props,
  ref
) {
  const { toggleColorMode } = useColorMode();
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: "5",
            height: "5",
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  );
});

export const LightMode = React.forwardRef(function LightMode(props, ref) {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme light"
      colorPalette="gray"
      colorScheme="light"
      ref={ref}
      {...props}
    />
  );
});

export const DarkMode = React.forwardRef(function DarkMode(props, ref) {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme dark"
      colorPalette="gray"
      colorScheme="dark"
      ref={ref}
      {...props}
    />
  );
});
