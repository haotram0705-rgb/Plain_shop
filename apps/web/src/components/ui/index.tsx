export function Button({ children }: { children: React.ReactNode }) {
  return <button type="button">{children}</button>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}
