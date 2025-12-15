const Footer = () => {
  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed footer */}
      <div className="h-14" />
      <footer className="fixed bottom-0 left-0 right-0 z-40 py-3 border-t border-border/30 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground font-medium tracking-wide">
            Designed & Developed by{" "}
            <span className="text-[#F9C846] font-semibold">Aryan Pol</span>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
