import { Bet } from "@/types";

export function AdminPanel({
	bets,
	onSetResult,
}: {
	bets: Bet[];
	onSetResult: (id: string, result: string) => void;
}) {
	return (
		<div>
			<div className="text-lg font-semibold mb-3">
				Admin Dashboard
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-white p-4 rounded-2xl border">
					<div className="text-sm text-gray-500">
						Open Bets
					</div>
					{bets.map((b) => (
						<div
							key={b.id}
							className="mt-3 p-3 border rounded"
						>
							<div className="flex justify-between">
								<div>
									<div className="font-semibold">
										{b.event}
									</div>
									<div className="text-xs text-gray-500">
										{b.creator} — $
										{b.amount}
									</div>
								</div>
								<div className="flex gap-2">
									<button
										className="px-2 py-1 rounded border"
										onClick={() =>
											onSetResult(
												b.id,
												'home'
											)
										}
									>
										Set Home
									</button>
									<button
										className="px-2 py-1 rounded border"
										onClick={() =>
											onSetResult(
												b.id,
												'away'
											)
										}
									>
										Set Away
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="bg-white p-4 rounded-2xl border">
					<div className="text-sm text-gray-500">
						Commission
					</div>
					<div className="mt-2 text-2xl font-bold">
						5% (MVP default)
					</div>
					<div className="mt-4 text-sm text-gray-500">
						Disputes and user management will be added
						in the next iteration.
					</div>
				</div>
			</div>
		</div>
	);
}
