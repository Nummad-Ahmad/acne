import React, { useState } from 'react';
import style from './app.module.css';
import { IoMdCloudUpload } from "react-icons/io";
import axios from "axios";

export default function App() {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState([]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("Please select an image.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setImage(e.target.result);
            console.log(e.target.result);
        };
        reader.readAsDataURL(file);
        uploadImage(file);
    };

    const uploadImage = (file) => {
        const formData = new FormData();
        formData.append("file", file);

        axios
        .post("http://localhost:5000/predict", formData)
        .then((response) => {
            console.log(response);
            setResult(response.data);
        })
        .catch((error) => console.error("Error:", error));
    };
    return (
        <div className={style.app}>
            <div className={style.container}>
                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Upload an Image for Acne Classification</p>
                {
                    !image ?
                    <>
                        <label htmlFor="file-input" className={style.customFileInput}>
                            <div className={style.uploadImage}>
                                <IoMdCloudUpload size={70} color='black' />
                                <p style={{ color: 'black' }}>Upload image</p>
                            </div>
                        </label>
                        <input

                                id="file-input"
                                className={style.imgInput}
                                type="file"
                                onChange={handleImageChange}
                                accept=".png, .jpeg, .jpg"
                            />
                            </>
                        :
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <label htmlFor="file-input" className={style.customFileInput}>
                            <div className={style.uploadImage}>
                                <IoMdCloudUpload size={70} color='black' />
                                <p style={{ color: 'black' }}>Upload image</p>
                            </div>
                        </label>
                        <input

                                id="file-input"
                                className={style.imgInput}
                                type="file"
                                onChange={handleImageChange}
                                accept=".png, .jpeg, .jpg"
                            />
                            {image && <img src={image} alt="Uploaded" className={style.img} />}
                        </div>
                }
                {
                    result.classification &&
                    <p style={{marginTop: '50px', fontSize: '20px', fontWeight: 'bold'}}>
                    {result.classification[0].label} {(result.classification[0].confidence* 100).toFixed(2)}%
                    </p>
                }
            </div>
        </div>
    )
}