import { ABSOLUTE_URLS } from "@/config/urls";

const DemoVideo = () => {
  return (
    <iframe
      className="w-full aspect-video"
      src={ABSOLUTE_URLS.YOUTUBE.DEMO_EMBED}
      allow="accelerometer; autoplay; encrypted-media; fullscreen; gyroscope; picture-in-picture"
    ></iframe>
  );
};

export default DemoVideo;
