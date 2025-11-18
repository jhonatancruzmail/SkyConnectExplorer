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

	const getPageNumbers = (isMobile: boolean = false) => {
		const pages: (number | string)[] = [];
		const maxVisible = isMobile ? 3 : 5;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (isMobile) {
				// on mobile, show maximum 3 pages around the current page, bc the screen is smaller, and looks cleaner
				if (currentPage === 1) {
					pages.push(1);
					if (totalPages > 2) pages.push(2);
					if (totalPages > 3) pages.push(3);
					if (totalPages > 3) pages.push("...");
					if (totalPages > 3) pages.push(totalPages);
				} else if (currentPage === totalPages) {
					if (totalPages > 3) pages.push(1);
					if (totalPages > 3) pages.push("...");
					if (totalPages > 2) pages.push(totalPages - 2);
					if (totalPages > 1) pages.push(totalPages - 1);
					pages.push(totalPages);
				} else {
					if (currentPage > 2) {
						pages.push(1);
						if (currentPage > 3) pages.push("...");
					}
					if (currentPage > 1) pages.push(currentPage - 1);
					pages.push(currentPage);
					if (currentPage < totalPages) pages.push(currentPage + 1);
					if (currentPage < totalPages - 1) {
						if (currentPage < totalPages - 2) pages.push("...");
						pages.push(totalPages);
					}
				}
			} else {
				// on desktop, its the original behavior before the mobile version
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
		}

		return pages;
	};

	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-center gap-2 md:gap-4 mt-8 mb-12 md:mb-16">
			<button
				onClick={handlePrevious}
				disabled={currentPage === 1}
				className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${currentPage === 1
					? "text-white/40 cursor-not-allowed"
					: "text-white hover:opacity-90"
					}`}
				style={{
					backgroundColor: currentPage === 1 ? 'rgba(0, 96, 255, 0.3)' : 'rgba(0, 96, 255, 1)'
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:hidden">
					<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
				<span className="hidden md:inline">Anterior</span>
			</button>

			<div className="flex md:hidden items-center gap-1">
				{getPageNumbers(true).map((page, index) => {
					if (page === "...") {
						return (
							<span key={`ellipsis-mobile-${index}`} className="px-1 text-white/50 text-sm">
								...
							</span>
						);
					}

					const pageNumber = page as number;
					const isActive = pageNumber === currentPage;

					return (
						<button
							key={`mobile-${pageNumber}`}
							onClick={() => onPageChange(pageNumber)}
							className={`w-8 h-8 rounded-lg font-medium transition-all duration-300 text-white hover:opacity-90 text-sm ${isActive ? 'ring-1 ring-white ring-offset-1 ring-offset-transparent scale-110' : ''
								}`}
							style={{
								backgroundColor: isActive ? 'rgba(0, 96, 255, 1)' : 'rgba(0, 96, 255, 0.6)'
							}}
						>
							{pageNumber}
						</button>
					);
				})}
			</div>

			<div className="hidden md:flex items-center gap-2">
				{getPageNumbers(false).map((page, index) => {
					if (page === "...") {
						return (
							<span key={`ellipsis-desktop-${index}`} className="px-2 text-white/50">
								...
							</span>
						);
					}

					const pageNumber = page as number;
					const isActive = pageNumber === currentPage;

					return (
						<button
							key={`desktop-${pageNumber}`}
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
			</div>

			<button
				onClick={handleNext}
				disabled={currentPage === totalPages}
				className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${currentPage === totalPages
					? "text-white/40 cursor-not-allowed"
					: "text-white hover:opacity-90"
					}`}
				style={{
					backgroundColor: currentPage === totalPages ? 'rgba(0, 96, 255, 0.3)' : 'rgba(0, 96, 255, 1)'
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:hidden">
					<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
				</svg>
				<span className="hidden md:inline">Siguiente</span>
			</button>
		</div>
	);
}

