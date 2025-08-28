import { Bet } from '@/types';

export function Dashboard({
	bets,
	onJoin,
	onOpenCreate,
}: {
	bets: Bet[];
	onJoin: (id: string) => void;
	onOpenCreate: () => void;
}) {
	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<div className="text-sm text-gray-500">
					Available open bets — join to lock funds
				</div>
				<div>
					<button
						className="px-3 py-1 rounded border"
						onClick={onOpenCreate}
					>
						Filter
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{bets.map((b) => (
					<div
						key={b.id}
						className="bg-white p-4 rounded-2xl border shadow-sm"
					>
						<div className="flex items-center justify-between">
							<div>
								<div className="text-sm text-gray-500">
									{b.event}
								</div>
								<div className="font-semibold text-lg">
									{b.creator} —{' '}
									{b.side.toUpperCase()}
								</div>
							</div>
							<div className="text-right">
								<div className="text-xl font-bold">
									${b.amount}
								</div>
								<div className="text-xs text-gray-400">
									{b.status}
								</div>
							</div>
						</div>

						<div className="mt-4 flex gap-2">
							{b.status === 'open' ? (
								<button
									className="px-3 py-2 rounded bg-indigo-600 text-white"
									onClick={() =>
										onJoin(b.id)
									}
								>
									Join
								</button>
							) : (
								<div className="px-3 py-2 rounded bg-gray-200">
									Matched
								</div>
							)}

							<button className="px-3 py-2 rounded border">
								Details
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
