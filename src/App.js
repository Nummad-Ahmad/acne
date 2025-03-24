import React, { useState } from 'react';
import style from './app.module.css';
import { IoMdCloudUpload } from "react-icons/io";
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

        fetch("http://localhots:5000/predict", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                setResult(data);
            })
            .catch(error => console.error("Error:", error));
    };
    return (
        <div className={style.app}>
            <div className={style.container}>
                <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Upload an Image for Acne Classification</p>
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
                {/* <input type="file" onChange={handleImageChange} accept="image/*"></input> */}
                {image && <img src={image} alt="Uploaded" className={style.img} />}
                {
                    result.classification &&
                    <p>Result {result.classification.result}</p> 
                    
                }
                {
                    result.classification &&
                    <p>Confidence {(result.classification.confidence * 100).toFixed(2)}%</p>
                }
                {
                    result.classification &&
                    result.classification.forEach(item => {
                        <p style={{ fontWeight: 'bold', fontSize: '20px' }}>{item.label} Confidence {(item.confidence * 100).toFixed(2)}%</p>
                    })
                }
            </div>
        </div>
    )
}