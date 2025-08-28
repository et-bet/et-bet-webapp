import { TelegramUser } from '@/types';

export function Header({
	telegramUser,
	onCreate,
}: {
	telegramUser: TelegramUser;
	onCreate: () => void;
}) {
	return (
		<div className="flex items-center justify-between">
			<div>
				<div className="text-sm text-gray-500">
					Welcome back
					{telegramUser?.name
						? `, ${telegramUser.name}`
						: ''}
				</div>
				<div className="text-2xl font-bold">Open Bets</div>
			</div>

			<div className="flex items-center gap-3">
				<button
					className="px-4 py-2 rounded bg-green-500 text-white"
					onClick={onCreate}
				>
					+ Create Bet
				</button>
				<button className="px-3 py-2 rounded border">
					History
				</button>
			</div>
		</div>
	);
}
