import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css'
import download from './download.png'

const Download = () => {
  const [show, setShow] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [fileName,setFileName] = useState('')
  const [fileSize,setFileSize] = useState('');
  const [error,setError] = useState(null)

  const { uuid } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {

        const res = await axios.get(`http://localhost:4000/files/${uuid}`);
        console.log(res.data);

        setDownloadLink(res.data.downloadLink);
        setFileName(res.data.fileName)
        setFileSize(res.data.fileSize)
        setShow(true);
      } catch (error) {
        console.error("Error fetching download link:", error.response.data.error);
        setError(error.response.data.error)
      }
    };

    fetchData();
  }, [uuid]);

  return (
    <div className='App'>
      {}
      {error ? (
        <div className='download-box'>
        <img src={download} alt="" />
        <h2>Sorry! {error}</h2>

      </div>
      ) : 
      show ? (
        <div className='download-box'>
          <img src={download} alt="" />
          <h2>Your File Is Ready To Download</h2>
          <span>Link expires in 24 hours</span>
          <h3>{fileName}</h3>
          <span className='size'>{Math.floor(fileSize/1000)} KB</span>
          <a href={downloadLink} >
            Download File
          </a>
        </div>
      ) : (

          <h2>Getting File Details...</h2>
          
      )}
    </div>
  );
};

export default Download;
