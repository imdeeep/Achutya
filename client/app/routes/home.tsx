import Layout from "../components/layout/Layout";

export function meta({}) {
  return [
    { title: "Achutya - travel planner" },
    {
      name: "description",
      content: "Achutya is a travel planner that helps you plan your trip.",
    },
  ];
}

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-cover bg-center bg-black h-[100vh] sm:h-[90vh]">
        Hello Achutya
      </section>
    </Layout>
  );
}
