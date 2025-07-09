import { RiLockUnlockFill } from "react-icons/ri";

export default function NoAccessPage() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center justify-center text-center w-[80%] md:w-[50%] h-[50%] bg-cards shadow-lg rounded-2xl p-6">
                <RiLockUnlockFill className="text-error text-6xl md:text-9xl mb-4" />
                <h1 className="text-6xl md:text-9xl font-bold text-primary">403</h1>
                <p className="text-xl md:text-3xl pt-4 text-secondary">Du hast keine Berechtigung, diese Seite zu sehen.</p>
            </div>
        </div>
    );
}