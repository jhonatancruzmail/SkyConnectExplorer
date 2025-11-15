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
		<div className="flex items-center justify-center gap-2 mt-8">
			<button
				onClick={handlePrevious}
				disabled={currentPage === 1}
				className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${currentPage === 1
					? "border border-white/30 border-dashed text-white/50 cursor-not-allowed"
					: "bg-blue-500 text-white hover:bg-blue-600"
					}`}
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
						className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${isActive
							? "bg-blue-500 text-white"
							: "bg-blue-500 text-white hover:bg-blue-600"
							}`}
					>
						{pageNumber}
					</button>
				);
			})}

			<button
				onClick={handleNext}
				disabled={currentPage === totalPages}
				className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${currentPage === totalPages
					? "border border-white/30 border-dashed text-white/50 cursor-not-allowed"
					: "bg-blue-500 text-white hover:bg-blue-600"
					}`}
			>
				Siguiente
			</button>
		</div>
	);
}

