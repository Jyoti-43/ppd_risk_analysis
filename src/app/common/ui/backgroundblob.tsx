import React, { memo } from 'react'

const BlobBackground = memo(function BlobBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute bottom-[5%] left-[15%] -z-10 animate-float opacity-40 text-accent"
        style={{ animationDelay: "2s" }}
      >
        <svg width="350" height="350" viewBox="0 0 200 200">
          {/* Paste your SVG path here */}
          <path
            fill="currentColor"
            d="M40,-50C52,-40,62,-26,65,-10C68,5,64,22,55,36C45,50,31,61,15,64C-1,67,-18,63,-32,54C-46,45,-56,31,-61,15C-66,-1,-66,-18,-58,-32C-50,-46,-34,-57,-18,-62C-2,-67,14,-66,40,-50Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* Bottom-Left Blob */}
      <div
        className="absolute  top-[5%] right-[15%] -z-10 animate-float opacity-30 text-button"
        style={{ animationDelay: "2s" }}
      >
        <svg width="300" height="300" viewBox="0 0 200 200">
          {/* Paste your SVG path here */}
          <path
            fill="currentColor"
            d="M44,-62C56,-54,64,-40,68,-25C72,-10,72,5,67,19C62,33,52,45,39,54C26,63,10,69,-6,72C-22,75,-44,75,-58,66C-72,57,-78,39,-79,22C-80,5,-76,-11,-68,-25C-60,-39,-48,-51,-34,-58C-20,-65,-5,-67,11,-62Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
    </div>
  );
});

export default BlobBackground;