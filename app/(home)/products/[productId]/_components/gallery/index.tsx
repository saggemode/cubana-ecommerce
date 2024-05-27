"use client";

import NextImage from "next/image";
import { Tab } from "@headlessui/react";
import { Image } from "@/types";
import GalleryTab from "./gallery-tab";

interface GalleryProps {
  images: Image[];
}

const Gallery: React.FC<GalleryProps> = ({ images = [] }) => {
  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {images.map((image) => (
            <GalleryTab key={image.id} image={image} />
          ))}
        </Tab.List>
      </div>
      <Tab.Panels className="aspect-square w-full">
        {images.map((image) => (
          <Tab.Panel key={image.id}>
            <div className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden">
              <NextImage
                fill
                src={image.url}
                alt="Image"
                className="object-cover object-center"
              />
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Gallery;

// "use client";
// import React, { useState } from "react";
// import { AiOutlineHeart } from "react-icons/ai";

// import NextImage from "next/image";
// import { Tab } from "@headlessui/react";

// import { Image } from "@/types";

// import GalleryTab from "./gallery-tab";

// interface GalleryProps {
//   images: Image[];
// }

// const Gallery: React.FC<GalleryProps> = ({
//   images = []
// }) => {
//   const [selectedImage, setSelectedImage] = useState<number>(0);
//   //const urlArray = images.split(",");
//   return (
//     <div className="images grid grid-cols-7">
//       <div className="all-images flex flex-col col-span-2 justify-center">
//         {images.map((image, index) => (
//           <div key={index} className="image relative rounded-lg">
//             <img
//               onClick={() => setSelectedImage(index)}
//               className={`w-[70px] h-[70px] rounded-lg mb-3 p-1 object-cover object-top ${
//                 selectedImage === index
//                   ? "border-[1px] border-purple-500"
//                   : "border-[1px] border-purple-200"
//               }`}
//               src={image.url}
//               alt={`Image ${index + 1}`}
//             />
//           </div>
//         ))}
//       </div>
//       <div className="selected-image col-span-5">
//         {/* <img
//           src={urlArray[selectedImage]}

//           className="h-[600px] w-auto object-cover object-top"
//           alt=""
//         /> */}
//       </div>

//     </div>
//   );
// };

// export default Gallery;
