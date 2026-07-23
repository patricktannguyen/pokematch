import type { Status } from "../hooks/usePokemonSelection";

interface Props {
  status: Status;
}

const LED_CLASS: Record<Status, string> = {
  idle: "bg-emerald-500",
  loading: "bg-amber-500 animate-pulse",
  error: "bg-red-500",
};

export function StatusLed({ status }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${LED_CLASS[status]}`}
    />
  );
}
