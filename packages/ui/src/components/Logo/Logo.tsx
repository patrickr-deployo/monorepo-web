import { cn } from "@package/utils"

type LogoProps = {
  color?: string
  className?: string
}

export function Logo({ color = "white", className }: LogoProps) {
  return (
    <section className="flex items-center gap-2 font-semibold">
      {/* <svg
        className={cn("w-[30px]", className)}
        fill="none"
        viewBox="0 0 163 86"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M69.5001 52.5002C69.5003 73.8071 112.317 77.6941 125.671 73.8073C144.551 68.3121 155.913 49.9713 149.616 35.1263C143.319 20.2813 133 16.4999 115 16.5"
          stroke={color}
          strokeLinecap="round"
          strokeWidth="21"
        />
        <path
          d="M85.4997 30.5002C85.4997 12.4246 50.0487 8.4606 36.7276 12.4246C17.8942 18.029 6.68712 36.4351 13.1096 51.2432C19.532 66.0514 27.9997 69.5 47.4997 69.5001"
          stroke={color}
          strokeLinecap="round"
          strokeWidth="21"
        />
      </svg> */}

      <svg
        className={cn("w-[29px] h-[29px]", className)}
        width="954"
        height="989"
        viewBox="0 0 954 989"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.51953 143.239L76.9495 92.1895L387.05 108.189L524.19 221.709L475.5 317.5L303.23 178.279L269.71 159.989C269.71 159.989 205.71 138.659 150.85 139.419C95.9895 140.179 1.51953 143.239 1.51953 143.239Z"
          fill="url(#paint0_linear_2023_7925)"
        />
        <path
          d="M0 144.76C0 144.76 109.71 0 399.24 0C598.4 0 819.28 101.48 910.57 286.08C977.6 421.62 961.73 593.56 895.88 727.52C831.91 857.66 711.26 939.41 571.57 970.74C513.1 983.85 453 988.96 393.14 988.96C393.14 988.96 136.34 966.91 66.09 912.49C63.64 910.59 61.41 908.65 59.43 906.67C59.43 906.67 245.33 970.67 355.05 860.96C464.77 751.25 467.81 589.72 409.91 431.25C352 272.76 185.9 128 22.86 240.76C22.86 240.76 38.1 195.05 155.43 166.09C191.95 157.08 227.74 154.86 262 159.24C337.81 168.95 406.19 211 458.66 283.42C458.66 283.42 369.8 132.66 216.37 111.23C62.95 89.81 0 144.76 0 144.76Z"
          fill="url(#paint1_linear_2023_7925)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_2023_7925"
            x1="262.86"
            y1="281.139"
            x2="262.86"
            y2="92.1895"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.69" stop-color="#050612" />
            <stop offset="0.96" stop-color="#210FA8" />
            <stop offset="1" stop-color="#050612" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_2023_7925"
            x1="476.85"
            y1="1000.75"
            x2="476.85"
            y2="11.8"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#080B12" />
            <stop offset="0.56" stop-color="#210FA8" />
            <stop offset="1" stop-color="#C924FA" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  )
}
