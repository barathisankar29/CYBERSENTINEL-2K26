import React, { useRef, useState } from 'react';

export const PersonOnePlaceholder: React.FC = () => {
  const [customImage, setCustomImage] = useState<string | null>(() => {
    return localStorage.getItem('person1_image_data') || null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setCustomImage(dataUrl);
          localStorage.setItem('person1_image_data', dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const _handleReset = () => {
    setCustomImage(null);
    localStorage.removeItem('person1_image_data');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setCustomImage(dataUrl);
          localStorage.setItem('person1_image_data', dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="relative group flex items-center justify-center"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {customImage ? (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className="relative w-56 h-56 xs:w-64 xs:h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[350px] lg:h-[350px] max-w-full flex items-center justify-center cursor-pointer select-none"
          title="Click or drag & drop to replace image"
        >
          <img
            src={customImage}
            alt="Person 1"
            className="w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(234,88,12,0.45)] transition-transform duration-200 group-hover:scale-[1.03]"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        /* The exact shape/box from the user's template (Image 1) */
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          title="Click to upload image at end of design phase"
          className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-[#ECECEC] flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] select-none shadow-md"
        >
          <span className="text-black text-xl sm:text-2xl font-normal font-sans tracking-wide">
            Person 1
          </span>
        </div>
      )}
    </div>
  );
};
