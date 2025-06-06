interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
