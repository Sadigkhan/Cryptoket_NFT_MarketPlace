const RootLayout = ({ children }) => {
  return (
    <main >
      <div>
        <section >
          <div className="pt-[90px]">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
