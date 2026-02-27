type AddOrderActionProps = {
    onAdd: () => void;
    className: string;
    children: React.ReactNode;
};

export function AddOrderAction({ onAdd, className, children }: AddOrderActionProps) {
    return (
        <button type="button" onClick={onAdd} className={className}>
            {children}
        </button>
    );
}