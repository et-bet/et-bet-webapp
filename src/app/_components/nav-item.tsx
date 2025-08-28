export function NavItem({
	label,
	active,
	onClick,
}: {
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={`w-full text-left px-3 py-2 rounded ${
				active
					? 'bg-indigo-50 ring-1 ring-indigo-200'
					: 'hover:bg-slate-50'
			}`}
		>
			<div className="font-medium">{label}</div>
		</button>
	);
}
