"use client";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 3) {
				for (let i = 1; i <= 4; i++) {
					pages.push(i);
				}
				pages.push("...");
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1);
				pages.push("...");
				for (let i = totalPages - 3; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				pages.push(1);
				pages.push("...");
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(i);
				}
				pages.push("...");
				pages.push(totalPages);
			}
		}

		return pages;
	};

	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-center gap-4 mt-8">
			<button
				onClick={handlePrevious}
				disabled={currentPage === 1}
				className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${currentPage === 1
					? "text-white/40 cursor-not-allowed"
					: "text-white hover:opacity-90"
					}`}
				style={{
					backgroundColor: currentPage === 1 ? 'rgba(0, 96, 255, 0.3)' : 'rgba(0, 96, 255, 1)'
				}}
			>
				Anterior
			</button>

			{getPageNumbers().map((page, index) => {
				if (page === "...") {
					return (
						<span key={`ellipsis-${index}`} className="px-2 text-white/50">
							...
						</span>
					);
				}

				const pageNumber = page as number;
				const isActive = pageNumber === currentPage;

				return (
					<button
						key={pageNumber}
						onClick={() => onPageChange(pageNumber)}
						className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 text-white hover:opacity-90 ${isActive ? 'ring-1 ring-white ring-offset-1 ring-offset-transparent scale-110' : ''
							}`}
						style={{
							backgroundColor: isActive ? 'rgba(0, 96, 255, 1)' : 'rgba(0, 96, 255, 0.6)'
						}}
					>
						{pageNumber}
					</button>
				);
			})}

			<button
				onClick={handleNext}
				disabled={currentPage === totalPages}
				className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${currentPage === totalPages
					? "text-white/40 cursor-not-allowed"
					: "text-white hover:opacity-90"
					}`}
				style={{
					backgroundColor: currentPage === totalPages ? 'rgba(0, 96, 255, 0.3)' : 'rgba(0, 96, 255, 1)'
				}}
			>
				Siguiente
			</button>
		</div>
	);
}

