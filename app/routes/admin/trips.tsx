import { Header, TripCard } from "components";
import { parseTripData } from "lib/utils";
import {
    useNavigate,
    useSearchParams,
    type LoaderFunctionArgs,
} from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import type { Route } from "./+types/trips";
import { useState } from "react";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const limit = 8;

    // get the current page number from the url
    const url = new URL(request.url);

    const page = parseInt(url.searchParams.get("page") || "1", 10);

    const offset = (page - 1) * limit;

    const { allTrips, total } = await getAllTrips(limit, offset);

    return {
        tirps: allTrips.map(({ $id, tripDetail, imageUrls }) => ({
            id: $id,
            ...parseTripData(tripDetail),
            imageUrls: imageUrls ?? [],
        })),
        total,
    };
};

const Trips = ({ loaderData }: Route.ComponentProps) => {
    const trips = loaderData?.tirps as Trip[] | [];

    const [searchParams] = useSearchParams();

    const initialPage = Number(searchParams.get("page") || "1");

    const [currentPage, setCurrentPage] = useState(initialPage);

    const navigate = useNavigate();

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        navigate(`?page=${page}`);
    };
    return (
        <main className="trips wrapper">
            <Header
                title={"Trips"}
                description="View and edit AI-generated travel plans"
                ctaText="Create a trip"
                ctaUrl="/trips/create"
            />
            <section className="mt-4">
                <h1 className="p-24-semibold text-dark-100 mb-4">
                    Manage Created Trips
                </h1>

                <div className="trip-grid mb-4">
                    {trips.map(
                        ({
                            id,
                            name,
                            imageUrls,
                            itienarary,
                            interests,
                            travelStyle,
                            estimatedPrice,
                        }: any) => (
                            <TripCard
                                id={id}
                                key={id}
                                name={name}
                                location={itienarary?.[0].location ?? ""}
                                imageUrl={imageUrls[0]}
                                tags={[interests, travelStyle]}
                                price={estimatedPrice}
                            />
                        )
                    )}
                </div>

                <PagerComponent
                    totalRecordsCount={loaderData.total}
                    pageSize={8}
                    currentPage={currentPage}
                    click={(args) => handlePageChange(args.currentPage)}
                    cssClass="!mb-4"
                />
            </section>
        </main>
    );
};

export default Trips;
