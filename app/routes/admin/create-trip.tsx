import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { Header } from "components";
import React, { useState } from "react";
import type { Route } from "./+types/create-trip";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "lib/utils";
import {
    LayerDirective,
    LayersDirective,
    MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import type { HTMLFormMethod } from "react-router";
import { account } from "~/appwrite/client";

export const loader = async () => {
    const repsonse = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flag,latlng,maps"
    );
    const data = await repsonse.json();

    return data.map((country: any) => ({
        name: country.flag + country.name.common,
        coordinates: country.latlng,
        value: country.name.common,
        openStreetMap: country.maps?.openStreetMaps,
    }));
};

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
    const countries = loaderData as Country[];
    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.name || "",
        travelStyle: "",
        interest: "",
        budget: "",
        duration: 0,
        groupType: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const countryData = countries.map((country) => ({
        text: country.name,
        value: country.value,
    }));

    const mapData = [
        {
            country: formData.country,
            color: "#ea382e",
            coordinates:
                countries.find(
                    (country: Country) => country.name === formData.country
                )?.coordinates || [],
        },
    ];

    const handleChange = (
        key: keyof TripFormData,
        value: string | number | undefined
    ) => {
        setFormData({
            ...formData,
            [key]: value,
        });
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);

        if (
            !formData.country ||
            !formData.budget ||
            !formData.duration ||
            !formData.groupType ||
            !formData.interest ||
            !formData.travelStyle
        ) {
            setError("Please enter all the fields.");
            setLoading(false);
            return;
        }

        if (formData.duration < 1 || formData.duration > 10) {
            setError("Duration must be between 1 and 10 days");
            setLoading(false);
            return;
        }

        const user = await account.get();

        if (!user.$id) {
            console.error("User not authenticated");
            setLoading(false);
            return;
        }

        try {
            setError("");
            console.log("User: ", user);
            console.log("formData: ", formData);
        } catch (error) {
            console.error("Error generating trip: ", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header
                title="Add a New Trip"
                description="View and edit AI-generated travel plans"
            />

            <section className="mt-2.5 wrapper-md">
                <form className="trip-form" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="country">Country</label>
                        <ComboBoxComponent
                            id="country"
                            dataSource={countryData}
                            fields={{ text: "text", value: "value" }}
                            placeholder="Select a Country"
                            className="combo-box"
                            change={(e: { value: string | undefined }) => {
                                if (e.value) {
                                    handleChange("country", e.value);
                                }
                            }}
                            allowFiltering
                            filtering={(e) => {
                                const query = e.text.toLowerCase();

                                e.updateData(
                                    countries
                                        .filter((country) =>
                                            country.name
                                                .toLowerCase()
                                                .includes(query)
                                        )
                                        .map((country) => ({
                                            text: country.name,
                                            value: country.value,
                                        }))
                                );
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="duration">Duration</label>
                        <input
                            id="duration"
                            name="duration"
                            placeholder="Enter number of days (1 - 10)"
                            className="form-input placeholder:text-gray-100"
                            onChange={(e) =>
                                handleChange("duration", Number(e.target.value))
                            }
                        />
                    </div>

                    {selectItems.map((key) => (
                        <div key={key}>
                            <label htmlFor={key}>{formatKey(key)}</label>

                            <ComboBoxComponent
                                id={key}
                                dataSource={comboBoxItems[key].map((item) => ({
                                    text: item,
                                    value: item,
                                }))}
                                className="combo-box"
                                fields={{ text: "text", value: "value" }}
                                placeholder={`Select ${formatKey(key)}`}
                                change={(e: { value: string | undefined }) => {
                                    if (e.value) {
                                        handleChange(key, e.value);
                                    }
                                }}
                                allowFiltering
                                filtering={(e) => {
                                    const query = e.text.toLowerCase();

                                    e.updateData(
                                        comboBoxItems[key]
                                            .filter((item) =>
                                                item
                                                    .toLowerCase()
                                                    .includes(query)
                                            )
                                            .map((item) => ({
                                                text: item,
                                                value: item,
                                            }))
                                    );
                                }}
                            />
                        </div>
                    ))}

                    <div>
                        <label htmlFor="location">Location on the map</label>

                        <MapsComponent>
                            <LayersDirective>
                                <LayerDirective
                                    dataSource={mapData}
                                    shapeData={world_map}
                                    shapeDataPath="country"
                                    shapePropertyPath="name"
                                    shapeSettings={{
                                        colorValuePath: "color",
                                        fill: "#e5e5e5",
                                    }}
                                />
                            </LayersDirective>
                        </MapsComponent>
                    </div>

                    <div className="bg-gray-200 h-px w-full">
                        {error && (
                            <div className="error">
                                <p>{error}</p>
                            </div>
                        )}

                        <footer className="px-6 w-full">
                            <ButtonComponent
                                type="submit"
                                className="button-class !h-12 !w-full"
                                disabled={loading}
                            >
                                <img
                                    src={`/assets/icons/${
                                        loading
                                            ? "loader.svg"
                                            : "magic-star.svg"
                                    }`}
                                    alt=""
                                    className={cn("size-5", {
                                        "animate-spin": loading,
                                    })}
                                />
                                <span className="p-16-semibold text-white">
                                    {loading ? "Generating" : "Generate a trip"}
                                </span>
                            </ButtonComponent>
                        </footer>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default CreateTrip;
