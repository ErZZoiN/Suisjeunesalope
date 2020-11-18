import logo from './logo.svg';
import * as React from 'react';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';

import './App.css';
// import "@tensorflow/tfjs-node";
import fs from "fs";
import fetch from "node-fetch";
import stream from "stream";

const Training = (props) => {

  const [Canvas, setCanvas] = React.useState();
  const [Image, setImage] = React.useState();
  const [ImageData, setImageData] = React.useState();
  const STD_SIZE = 500;

  React.useEffect( async () => {
    setCanvas(canvas.Canvas);
    setImage(canvas.Image);
    setImageData(canvas.ImageData);

    //faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
    faceapi.env.monkeyPatch({
      Canvas: HTMLCanvasElement,
      Image: HTMLImageElement,
      ImageData: ImageData,
      Video: HTMLVideoElement,
      createCanvasElement: () => document.createElement('canvas'),
      createImageElement: () => document.createElement('img')
      })

    await faceapi.loadFaceRecognitionModel('');
    await faceapi.loadSsdMobilenetv1Model('');
    await faceapi.loadFaceLandmarkModel('');


    let uri = "bibi.png";
    let filename = uri.split("/");


    // //Créer le descriptor
    // console.log(`Analysing face descriptors`);
    // let descriptors = await getDescriptors(filename);
    // console.log(`Descriptor : ${descriptors}`);
    // let jsondesc = JSON.stringify(descriptors);

    // console.log("BLBLBLBLBL");
    // console.log(jsondesc);

    var descriptors;
    let descuri = 'desc.json';
    fetch("desc.json")
      .then(response => response.json())
      .then(json => {
        descriptors = new Float32Array(Object.values(json)); 
        console.log(`desc : ${descriptors}`);
      });


    //Sauver
    //console.log(descriptors);
    // fs.unlinkSync(filename);
    // fs.unlinkSync(modifiedFilename);

    // channel.sendToQueue("dblink.adddescriptors", Buffer.from(JSON.stringify({
    //   handle,
    //   descriptors
    // })));

  }, [])

  const getDescriptors = async filename => {
    
    const input = await canvas.loadImage(filename);

    const fullFaceDescription = await faceapi.detectSingleFace(input).withFaceLandmarks().withFaceDescriptor();

    if (!fullFaceDescription) {
      console.log(`No faces detected for ${filename}`);
      return;
    }
 
    const faceDescriptors = fullFaceDescription.descriptor;
    return faceDescriptors;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Testez une image :
        </p>
      </header>
    </div>
  );
}

export default Training;
