import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_KEY_SECRET;

export const uploadFileToPinata = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      }
    );

    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    return ipfsUrl;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    return null;
  }
};

// Blob save to pinata
// export const uploadJSONToPinata = async (json) => {
//   try {
//     const formData = new FormData();
//     formData.append("file", new Blob([JSON.stringify(json)], { type: "application/json" }));

//     const response = await axios.post(
//       "https://api.pinata.cloud/pinning/pinFileToIPFS",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           pinata_api_key: apiKey,
//           pinata_secret_api_key: apiSecret,
//         },
//       }
//     );

//     const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
//     return ipfsUrl;
//   } catch (error) {
//     console.error("Error uploading JSON to Pinata:", error);
//     return null;
//   }
// };


// Directly save Json to pinata
export const uploadJSONToPinata = async (json) => {
  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      json, // Directly Saves Json
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      }
    );

    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    return ipfsUrl;
  } catch (error) {
    console.error("Error uploading JSON to Pinata:", error);
    return null;
  }
};
