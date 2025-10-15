"use client";

import { useParams } from "next/navigation";

export default function Page() {
  //Get the ID from the URL params
  const { id } = useParams();
  return <div>Order Details Page for Order ID: {id}</div>;
}
