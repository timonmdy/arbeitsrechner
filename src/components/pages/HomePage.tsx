import {FiLoader} from "react-icons/fi"
import {Carousel} from "../lib/layout/Carousel"
import {FancyCard} from "../lib/cards/FancyCard";
import {appsConfig} from "../../config/Apps.config";
import {useNavigate} from "react-router";

export default function HomePage() {
    const isLoading = false;
    const navigate = useNavigate();

    return (
        <div className="h-full px-6 py-12 sm:px-6 md:px-12">
            {isLoading ? (
                <div className="flex justify-center items-center h-60">
                    <FiLoader className="animate-spin w-6 h-6 text-accent" />
                </div>
            ) : (
                <div className="text-text-primary hover:text-accent transition-colors duration-300">
                    <h1 className="text-2xl font-bold mb-4">
                        Anwendungen
                    </h1>


                    <div className="overflow-hidden">
                        <Carousel>
                            {appsConfig.map((app, index) => (
                                <FancyCard
                                    key={index}
                                    title={app.title}
                                    description={app.description}
                                    subText={app.subText}
                                    buttonText={app.buttonText ?? "Loslegen"}
                                    onClick={() => navigate(app.link)}
                                />
                            ))}
                        </Carousel>
                    </div>
                </div>
            )}
        </div>
    )
}
