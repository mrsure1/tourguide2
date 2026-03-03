import { getTourById } from "@/app/guide/tours/actions";
import { notFound } from "next/navigation";
import TourDetailClient from "./TourDetailClient";

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tour = await getTourById(id);

    if (!tour) {
        notFound();
    }

    return <TourDetailClient tour={tour} />;
}

