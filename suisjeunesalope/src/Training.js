import logo from './logo.svg';
import * as React from 'react';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import sharp from "sharp";

import './App.css';
import "@tensorflow/tfjs-node";
import nodeCanvas from "canvas";
import fs from "fs";
import fetch from "node-fetch";
import util from "util";
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

    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

    await faceapi.loadFaceRecognitionModel('');


    //Choper l'image
    let uri = "bibi.png";
    let filename = uri.split("/");
    filename = filename[filename.length - 1];
    let fileExtension = filename.substr(filename.lastIndexOf(".") + 1);
    if (filename === fileExtension) {
      fileExtension = "jpg";
      filename = `${filename}.${fileExtension}`;
    }
    filename = `tmp/${filename}`;
    //await downloadImage(uri, filename);

    //resize l'image
    console.log(`Image was downloaded, resizing`);
    let modifiedFilename = filename.replace(`.${fileExtension}`, `__resized.jpg`);
    await sharp(filename)
      .resize({ width: STD_SIZE, height: STD_SIZE, fit: "cover" })
      .jpeg()
      .toFile(modifiedFilename)
      .catch(e => console.log("Error transforming image", e));
    console.log(`Image resized to ${STD_SIZE}x${STD_SIZE} for handle id`)

    //Créer le descriptor
    // console.log(`Analysing face descriptors`);
    // let descriptors = await getDescriptors(filename);
    // console.log(`Analysis completed. Cleaning up and sending data to DB`);

    //Sauver
    //console.log(descriptors);
    // fs.unlinkSync(filename);
    // fs.unlinkSync(modifiedFilename);

    // channel.sendToQueue("dblink.adddescriptors", Buffer.from(JSON.stringify({
    //   handle,
    //   descriptors
    // })));

  }, [])

  const downloadImage = async (uri, filename) => {
    const streamPipeline = util.promisify(stream.pipeline);
    const response = await fetch(uri);
    if (response.ok) {
      return streamPipeline(response.body, fs.createWriteStream(filename));
    }

    if (response.status === 404) {
      return fs.copyFileSync(`${__dirname}/assets/default_profile.png`, filename);
    }

    throw new Error(`Unexpected response ${response.status} ${response.statusText}`);
  };

  const getDescriptors = async filename => {
    const input = await nodeCanvas.loadImage(filename);

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
