import "react-native";

declare module "react-native" {
  interface PressableStateCallbackType {
    readonly pressed: boolean;
    readonly hovered: boolean;
  }

  interface ViewStyle {
    /** @platform web */
    $$css?: true;
  }
}

// From Solito.
// declare module 'react-native' {
//   interface PressableStateCallbackType {
//     hovered?: boolean
//     focused?: boolean
//   }
//   interface ViewStyle {
//     transitionProperty?: string
//     transitionDuration?: string
//   }
//   interface TextProps {
//     accessibilityComponentType?: never
//     accessibilityTraits?: never
//     accessibilityLevel?: number
//     href?: string
//     hrefAttrs?: {
//       rel: 'noreferrer'
//       target?: '_blank'
//     }
//   }
//   interface ViewProps {
//     accessibilityRole?: string
//     href?: string
//     hrefAttrs?: {
//       rel: 'noreferrer'
//       target?: '_blank'
//     }
//     onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
//   }
// }
