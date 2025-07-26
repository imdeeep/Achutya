import Layout from '~/components/layout/Layout'


type TeamMember = {
  name: string;
  role: string;
  image: string;
  bio: string;
};

const team: TeamMember[] = [
  {
    name: "Aarav Sharma",
    role: "CEO & Founder",
    image: "https://via.placeholder.com/100",
    bio: "Aarav is the visionary leader and strategic brain behind our travel community platform.",
  },
  {
    name: "Ishita Mehta",
    role: "Head of Design",
    image: "https://via.placeholder.com/100",
    bio: "Ishita blends art and UX to deliver smooth and delightful design experiences.",
  },
  {
    name: "Rohan Kapoor",
    role: "CTO",
    image: "https://via.placeholder.com/100",
    bio: "Tech geek with a passion for clean architecture and solving complex problems.",
  },
];

const values = [
  "Sustainable Tourism",
  "User-Centered Planning",
  "Transparency",
  "Diversity and Inclusion",
  "Love for Exploration",
];
export default function About() {
  return (
    <Layout>
    <div className="bg-white text-gray-800">
      <div
        className="bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')] bg-cover bg-center text-white py-24 h- text-center"
      
      >
        <div className=" bg-opacity-50 py-10 px-4">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="mt-4 text-lg">Empowering explorers through thoughtful travel experiences</p>
        </div>
      </div>


      <div className="max-w-5xl mx-auto px-4 py-10">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Our Story</h2>
          <p className="text-gray-700 leading-7">
            Born from the dreams of a few travel enthusiasts, our mission is to create an inclusive
            and seamless travel experience for everyone. We are a team of wanderers, designers, and
            technologists building meaningful adventures for real people.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Meet the Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                  />
                <h3 className="text-lg font-bold text-center text-green-700">{member.name}</h3>
                <p className="text-sm text-center text-gray-600 italic">{member.role}</p>
                <p className="text-sm text-gray-700 mt-2 text-center">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Our Core Values</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            {values.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Our Offices</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-green-700 font-bold">Delhi Office</h4>
              <p className="text-sm text-gray-700">4th Floor, Connaught Place, New Delhi - 110001</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-green-700 font-bold">Bangalore Office</h4>
              <p className="text-sm text-gray-700">2nd Floor, Indiranagar, Bengaluru - 560038</p>
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-green-700 text-white text-center p-6 mt-10">
        <p>© 2025 WanderWave Travel Pvt Ltd. All rights reserved.</p>
      </footer>
    </div>
</Layout>
  );
};