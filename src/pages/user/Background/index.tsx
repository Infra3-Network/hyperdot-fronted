/**
 * Functional component representing a background video.
 * @function
 * @param {Object} props - Props containing the video source.
 * @param {string} props.src - The source URL of the video.
 * @returns {JSX.Element} - JSX element representing the BackgroundVideo component.
 */
const BackgroundVideo = ({ src }: { src: string }): JSX.Element => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
      }}
    >
      <video
        autoPlay
        loop
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default BackgroundVideo;
