import axios from "axios";
import { useState } from "react";
import "../App.css";
import upload from "./upload.png";
import copy from "./copy.png";

function Upload() {
    const [link, setLink] = useState(null);
    const [uuid, setUuid] = useState(null);
    const [emailFrom,setEmailFrom] = useState(null);
    const [emailTo,setEmailTo] = useState(null);
    const [isInputCopied, setIsInputCopied] = useState(false);


    // const [copyClick, setCopyClick] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInput = async (e) => {
        const selectedFile = e.target.files[0];
        console.log(selectedFile);
        if (selectedFile) {
            if (selectedFile.size / 1000 > 10 * 1024) {
                alert("file size must be less than 10 MB");
            } else {
                try {
                    setLoading(true);
                    setLink(false);
                    const formData = new FormData();
                    formData.append("myfile", selectedFile);

                    const res = await axios.post(
                        "http://localhost:4000/api/files",
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    setTimeout(() => {
                        setLoading(false);
                        setLink(res.data.file);
                        const id = res.data.file.split("/").pop();
                        setUuid(id);
                    }, 1500);
                } catch (error) {
                    console.error("Error uploading file: ", error);
                }
            }
        }
    };

    // const handleDownload = () => {
    //     window.open(link, "_blank");
    // };

    const handleClick = () => {
        navigator.clipboard.writeText(link);
        setIsInputCopied(true);
    setTimeout(() => {
        setIsInputCopied(false);
    }, 1000); // Reset the color after 1 second
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragging(false);
        const uploadedFile = e.dataTransfer.files[0];
        if (uploadedFile) {
            if (uploadedFile.size / 1000 > 10240) {
                alert("file size must be less than 10 MB");
            } else {
                setLoading(true);
                setLink(false);
                try {
                    const formData = new FormData();
                    formData.append("myfile", uploadedFile);

                    const res = await axios.post(
                        "http://localhost:4000/api/files",
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    console.log("File uploaded", res);
                    setTimeout(() => {
                        setLoading(false);
                        setLink(res.data.file);
                        const id = res.data.file.split("/").pop();
                        setUuid(id);
                    }, 1500);
                } catch (error) {
                    console.error("Error uploading file: ", error);
                }
            }
        }
    };

    const sendEmail = async(e) =>{
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:4000/api/files/send',{uuid,emailTo,emailFrom})
            console.log(res.data)
            alert(res.data)
        } catch (error) {
            console.log(error)
            alert(error.response.data.error)
        }
    }

    return (
        <div className="App">
            <h1>File Sharing</h1>
            <div className="border">
                <form
                    className={`form ${dragging ? "dragging" : ""}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <div className="upload-container">
                        <img
                            src={upload}
                            alt=""
                            className={`left ${dragging ? "dragging" : ""}`}
                        />
                        <img
                            src={upload}
                            alt=""
                            className={`right ${dragging ? "dragging" : ""}`}
                        />
                        <img
                            src={upload}
                            alt=""
                            className={`center ${dragging ? "dragging" : ""}`}
                        />
                    </div>

                    <span className="drop">
                        Drop your file here or,
                        <label htmlFor="fileInput"> browse</label>
                    </span>
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        onChange={handleInput}
                        required
                    />
                </form>

                {loading && <label style={{ alignItems: "center" }}>Loading ...</label>}

                {link && (
                    <div>
                        <div className="data">
                            <span style={{ textAlign: "center", color: "white" }}>Link expires in 24 hrs </span>
                            <div className="input-copy">
                                <input type="text" value={link} disabled   style={{ color: isInputCopied ? 'yellow' : 'rgb(2, 255, 255)' }}/>
                                <img src={copy} alt="" onClick={handleClick} />
                            </div>
                            {/* <div className="row">
                            <button className="open" onClick={handleDownload}>
                                Open
                            </button>
                            <button className="copy" onClick={handleClick}>
                                Copy
                            </button>
                            {copyClick && (
                                <span className="copy-to-clipboard">Copy To Clipboard</span>
                            )}
                        </div> */}
                        </div>
                        <form className="email-form">
                            <span style={{ textAlign: "center" }}>Or Send via Email</span>
                            <div className="box">
                                <div className="email-box">
                                    <label>Your Email</label>
                                    <input type="email" className="email-input" required  onChange={(e)=>setEmailFrom(e.target.value)}/>
                                </div>
                                <div className="email-box">
                                    <label>Receiver's Email</label>
                                    <input type="email" className="email-input" required onChange={(e)=>setEmailTo(e.target.value)}/>
                                </div>

                                <button type="submit" className="another" onClick={sendEmail}>Send</button>
                            </div>
                        </form>
                    </div>

                )}

            </div>
        </div>
    );
}

export default Upload;
