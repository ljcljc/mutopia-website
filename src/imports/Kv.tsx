const imgImageWithFallback = "/images/grooming-hero.png";

function ImageWithFallback() {
  return (
    <div className="relative size-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgImageWithFallback} />
    </div>
  );
}

export default function Kv() {
  return (
    <div className="relative size-full" data-name="KV">
      <div className="absolute flex inset-[-2.4%_-4.7%] items-center justify-center">
        <div className="flex-none h-[499.182px] rotate-[4deg] w-[360.779px]">
          <ImageWithFallback />
        </div>
      </div>
    </div>
  );
}
