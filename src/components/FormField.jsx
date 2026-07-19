const baseClasses = 'w-full rounded-xl border border-ink-200 bg-ink-50/50 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100';

export const FieldLabel = ({ children, required }) => (
  <label className="mb-1.5 block text-xs font-semibold text-ink-600">
    {children}
    {required && <span className="ml-0.5 text-rose-500">*</span>}
  </label>
);

export const TextInput = (props) => <input {...props} className={`${baseClasses} ${props.className || ''}`} />;

export const TextArea = (props) => <textarea {...props} className={`${baseClasses} resize-none ${props.className || ''}`} />;

export const SelectInput = (props) => <select {...props} className={`${baseClasses} ${props.className || ''}`} />;
