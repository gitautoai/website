import DemoVideo from "@/app/components/videos/Demo";

const Demo = () => {
  return (
    <section className="w-full max-w-4xl mx-auto my-16 px-4" aria-label="Demo video section">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-4xl font-bold mb-3">
          See GitAuto in Action – <span className="text-pink-500">Under a Minute</span>
        </h2>
        <p className="text-lg text-gray-600">
          Watch how we solve the test coverage problem once and for all
        </p>
      </div>
      <div className="relative rounded-xl overflow-hidden shadow-xl">
        <DemoVideo />
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 italic">
          &ldquo;Install once, enable scheduling, and watch your coverage climb to 80%+&rdquo;
        </p>
      </div>
    </section>
  );
};

export default Demo;