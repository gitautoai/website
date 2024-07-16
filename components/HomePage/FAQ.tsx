const FAQ = () => {
  return (
    <div id="faq" className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-center text-3xl">FAQ</h2>
      <div className="flex flex-col gap-5 mt-5">
        <div className="flex flex-col">
          <span className="font-bold text-lg">Do we retain your data?</span>
          <span className="text-md">
            No, we don&apos;t retain your data. We read but we don&apos;t clone your repo or save
            your data.
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg">What languages do we support?</span>
          <span className="text-md">GitAuto supports virtually all languages.</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg">Is there a repository limit?</span>
          <span className="text-md">There is not.</span>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
