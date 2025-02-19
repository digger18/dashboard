import type { LucideIcon } from 'lucide-react'
import { TerminalIcon } from 'lucide-react'
import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function IconContainer({
  icon: Icon,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  icon?: LucideIcon
}): React.ReactElement<unknown> {
  return (
    <div
      {...props}
      className={cn(
        '[a[data-active=true]_&]:text-accent-fg from-bg to-bg-100 [a[data-active=true]_&]:from-accent/60 [a[data-active=true]_&]:to-accent rounded-sm border bg-gradient-to-b p-2',
        props.className
      )}
    >
      {Icon ? (
        <Icon className="h-4 w-4" />
      ) : (
        <TerminalIcon className="h-4 w-4" />
      )}
    </div>
  )
}

export function PiSmileyHeartEyesFill({ size = '32px' }: { size?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M100 18.75C83.9303 18.75 68.2214 23.5152 54.86 32.4431C41.4985 41.371 31.0844 54.0605 24.9348 68.907C18.7852 83.7535 17.1762 100.09 20.3112 115.851C23.4463 131.612 31.1846 146.089 42.5476 157.452C53.9106 168.815 68.388 176.554 84.1489 179.689C99.9099 182.824 116.247 181.215 131.093 175.065C145.94 168.916 158.629 158.502 167.557 145.14C176.485 131.779 181.25 116.07 181.25 100C181.227 78.4581 172.66 57.8051 157.427 42.5727C142.195 27.3403 121.542 18.7727 100 18.75ZM136.656 121.875C128.617 135.773 115.258 143.75 100 143.75C84.7422 143.75 71.3829 135.781 63.3438 121.875C62.8916 121.164 62.5879 120.368 62.4511 119.536C62.3143 118.705 62.3472 117.854 62.5477 117.035C62.7483 116.216 63.1123 115.447 63.6181 114.772C64.1238 114.098 64.7607 113.533 65.4905 113.111C66.2203 112.689 67.0278 112.419 67.8646 112.318C74.2073 111.547 82.1655 111.818 89.695 112.075H89.6951C93.3036 112.198 96.8136 112.318 100 112.318C103.192 112.318 106.703 112.198 110.312 112.074H110.312C117.837 111.818 125.784 111.546 132.135 112.318C132.972 112.419 133.78 112.689 134.51 113.111C135.239 113.533 135.876 114.098 136.382 114.772C136.888 115.447 137.252 116.216 137.452 117.035C137.653 117.854 137.686 118.705 137.549 119.536C137.412 120.368 137.108 121.164 136.656 121.875ZM80.1654 87.3333C81.9037 85.63 83.6654 83.5883 83.6654 80.9167C83.6654 79.2149 82.9893 77.5828 81.786 76.3794C80.5826 75.176 78.9505 74.5 77.2487 74.5C75.1954 74.5 73.7487 75.0833 71.9987 76.8333C70.2487 75.0833 68.802 74.5 66.7487 74.5C65.0469 74.5 63.4148 75.176 62.2114 76.3794C61.0081 77.5828 60.332 79.2149 60.332 80.9167C60.332 83.6 62.082 85.6417 63.832 87.3333L71.9987 95.5L80.1654 87.3333ZM139.665 80.9167C139.665 83.5883 137.904 85.63 136.165 87.3333L127.999 95.5L119.832 87.3333C118.082 85.6417 116.332 83.6 116.332 80.9167C116.332 79.2149 117.008 77.5828 118.211 76.3794C119.415 75.176 121.047 74.5 122.749 74.5C124.802 74.5 126.249 75.0833 127.999 76.8333C129.749 75.0833 131.195 74.5 133.249 74.5C134.951 74.5 136.583 75.176 137.786 76.3794C138.989 77.5828 139.665 79.2149 139.665 80.9167Z"
        fill="currentColor"
        style={{ fill: 'currentColor', fillOpacity: 1 }}
      />
    </svg>
  )
}
