
interface Props {
  activa: boolean;
  onToggle: () => void;
}

function TorchButton({ activa, onToggle }: Props) {
  return (
    <button
      className="btn btn--ghost"
      onClick={onToggle}
    >
      {activa ? "Apagar linterna" : "Encender linterna"}
    </button>
  );
}

export default TorchButton;
