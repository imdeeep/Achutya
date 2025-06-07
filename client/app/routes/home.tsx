import Page1 from "~/components/sections/Home/Page1";
import Layout from "../components/layout/Layout";

export function meta({}) {
  return [
    { title: "Achutya - Discover Your Next Adventure" },
    {
      name: "description",
      content:
        "Achutya is your ultimate travel companion. Explore the world's most breathtaking destinations and plan unforgettable journeys.",
    },
  ];
}

export default function Home() {
  return (
    <Layout>

      {/* Hero Section */}
      <Page1/>

      {/* Popular Destinations */}

     

      {/* Testimonials */}
    

      {/* Ready to Start Your Next Adventure? */}
    </Layout>
  );
}