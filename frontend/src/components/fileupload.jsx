import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



const Hero = () => (
    <section className="hero">
  
      <div className="hero__content">
        <h1 className="hero__title">ImageCompress</h1>
      </div>
    </section>
  );

function FileUpload() {
    const [files, setFiles] = useState([]);
    const [compressionType, setCompressionType] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    

    const onFileChange = (event) => {
        setFiles(Array.from(event.target.files));
    };

    const onCompressionTypeChange = (event) => {
        setCompressionType(event.target.value);
    };

    const allFilesAreImages = () => {
        return files.every(file => file.type.startsWith('image/'));
    };

    const uploadFiles = async (endpoint, files) => {
        const formData = new FormData();
        files.forEach(file => {
            const filename = file.webkitRelativePath || file.name;
            formData.append(`files`, file, filename);
        });
        try {
            const response = await axios.post(`http://localhost:8080${endpoint}`, formData, {
                responseType: 'blob',
            });

            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            if (compressionType === 'image') {
                if (files.length === 1){
                    debugger;
                    link.setAttribute('download', files[0].name);
                }
                else {
                    link.setAttribute('download', 'compressed.zip');
                }
            }
            else {
                link.setAttribute('download', `compressed.${compressionType}`);
            }
            document.body.appendChild(link);
            link.click();
            link.remove();

            setUploadStatus('Files uploaded and compressed successfully.');
        } catch (error) {
            console.error('Error uploading files', error);
            setUploadStatus('Failed to upload and compress files.');
        }
    };

    const onFormSubmit = async (event) => {
        event.preventDefault();
        let endpoint = '';
        switch (compressionType) {
       
            case 'image':
                if (files.length === 1) {
                    endpoint = '/upload-image';
                }
                else {
                    endpoint = '/upload-multiple-images';
                }
                break;
            default:
                setUploadStatus('Please select a valid compression type.');
                return;
        }

        await uploadFiles(endpoint, files);
    };

    return (
        <main>  
            <Hero />
        <div className="container mt-5">
            <Form onSubmit={onFormSubmit}>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload The Selected File</Form.Label>
                  
                    <Form.Control 
                        type="file" 
                       
                        onChange={onFileChange} 
                    />
                </Form.Group>

                <Form.Group controlId="compressionType" className="mb-3">
                    <Form.Label>Select Compression Type</Form.Label>
                    <Form.Select onChange={onCompressionTypeChange}>
                        <option value="" disabled selected>Select a compression type</option>
                    
                        {allFilesAreImages() && <option value="image">Image Compression</option>}
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Upload
                </Button>
            </Form>
            {uploadStatus && <Alert className="mt-3">{uploadStatus}</Alert>}
        </div>
        </main>
    );
}

export default FileUpload;
