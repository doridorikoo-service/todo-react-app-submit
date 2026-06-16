function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="glass-panel flex flex-col items-center rounded-2xl px-6 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400 dark:bg-indigo-950/40 dark:text-indigo-300">
        <Icon className="h-8 w-8" />
      </div>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
        {title}
      </p>
      {description && (
        <p className="mt-1.5 max-w-[240px] text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

export default EmptyState;
