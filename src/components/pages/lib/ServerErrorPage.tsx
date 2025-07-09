import { RiErrorWarningFill } from "react-icons/ri";

export default function ServerErrorPage({ message = "Interner Serverfehler. Bitte versuche es später noch einmal."}: { message: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center text-center w-[80%] md:w-[50%] h-[50%] bg-cards shadow-lg rounded-2xl p-6">
        <RiErrorWarningFill className="text-error text-6xl md:text-9xl mb-4" />
        <h1 className="text-6xl md:text-9xl font-bold text-primary">500</h1>
        <p className="text-xl md:text-3xl pt-4 text-secondary">
          {message}
        </p>
      </div>
    </div>
  );
}