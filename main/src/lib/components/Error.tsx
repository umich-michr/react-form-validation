export default function Error({
  name,
  errorClass,
  errors
}: {
  name: string;
  errorClass?: string;
  errors: Record<string, string[]>;
}) {
  return (
    <div>
      {errors && Array.isArray(errors[name]) && errors[name].length > 0 && (
        <div className={errorClass} id={'error-' + name} aria-hidden='false'>
          <span>{errors[name][0]}</span>
        </div>
      )}
    </div>
  );
}
