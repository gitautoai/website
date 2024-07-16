const DemoVideo = () => {
  return (
    <iframe
      className="w-full aspect-video"
      src={`https://www.youtube.com/embed/gulhHrKCPxQ?autoplay=1&mute=1&loop=1&playlist=gulhHrKCPxQ&rel=0`}
      allow="accelerometer; autoplay; encrypted-media; fullscreen; gyroscope; picture-in-picture"
    ></iframe>
  );
};

export default DemoVideo;
