type Props = { cuantas: number; de?: number; tam?: number };

const D =
  "M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z";

export function Estrellas({ cuantas, de = 3, tam = 14 }: Props) {
  return (
    <span
      style={{ display: "inline-flex", gap: 3 }}
      role="img"
      aria-label={`${cuantas} de ${de} estrellas`}
    >
      {Array.from({ length: de }, (_, i) => (
        <svg key={i} width={tam} height={tam} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d={D}
            fill={i < cuantas ? "var(--ambar)" : "none"}
            stroke={i < cuantas ? "none" : "var(--tenue)"}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}
