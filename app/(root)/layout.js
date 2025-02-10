const RootLayout = ({ children }) => {
  return (
    <main >
      <div>
        <section >
          <div >{children}</div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
