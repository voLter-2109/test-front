interface Props {
  message: string | undefined;
}
const ErrorMessage = ({ message }: Props) => {
  if (!message) return null;

  return <p className="text-red-500">{message}</p>;
};

export default ErrorMessage;
