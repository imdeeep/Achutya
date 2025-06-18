import { Link } from "react-router";

const unauthorized = () => {
  return (
    <div className="text-black bg-white min-h-screen">
      You are not authorized to access this page.
      <br />
      <Link className="text-blue-600 underline mx-2" to={"/"}>
        Go to Home
      </Link>
    </div>
  );
};

export default unauthorized;
