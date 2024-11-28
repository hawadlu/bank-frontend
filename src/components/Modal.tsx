const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const handleCloseClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={handleOverlayClick}
            />

            {/* Modal Content */}
            <div
                className="relative z-50 w-full max-w-lg bg-white rounded-lg shadow-lg"
                onClick={handleModalClick}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={handleCloseClick}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        Close
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;