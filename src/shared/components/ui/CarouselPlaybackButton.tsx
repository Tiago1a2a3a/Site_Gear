type CarouselPlaybackButtonProps = Readonly<{
  isPlaying: boolean;
  onClick: () => void;
}>;

export function CarouselPlaybackButton({
  isPlaying,
  onClick,
}: CarouselPlaybackButtonProps) {
  return (
    <button className="carousel-playback" onClick={onClick} type="button">
      {isPlaying ? "Pausar" : "Retomar"} destaques
    </button>
  );
}
