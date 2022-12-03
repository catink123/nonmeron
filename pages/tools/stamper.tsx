import { Approval, Photo } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Button, Collapse, Paper, Stack, Typography } from "@mui/material";
import Head from "next/head";
import React, { useState } from "react";
import CenterBox from "../../src/components/CenterBox";
import { FastAverageColor } from 'fast-average-color';
import TitleContainer from "../../src/components/TitleContainer";

const stamperConstants = {
  top: 128,
  left: 128,
  scaling: 5,
  width: 144,
  height: 32
}

export default function Stamper() {
  const [canProcess, setCanProcess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isErrored, setIsErrored] = useState(false);

  const [savedImage, setSavedImage] = useState<null | { name: string; src: string }>(null);
  const [resultImage, setResultImage] = useState<null | string>(null);

  function onError() {
    setIsErrored(true);
    setIsProcessing(false);
  }

  function handleClick() {
    setIsErrored(false);
    setResultImage(null);
    setIsProcessing(true);
    let canv = document.createElement('canvas');
    let c = canv.getContext('2d')!;
    let image = document.createElement('img');
    image.onload = async () => {
      canv.width = image.width;
      canv.height = image.height;

      let { top, left, width, height, scaling } = stamperConstants;

      let fac = new FastAverageColor();
      let averageColor = fac.getColor(image, {
        top,
        left,
        width: width * scaling,
        height: height * scaling
      });
      c.save();
      c.filter = `grayscale(100%) invert(100%) brightness(${averageColor.isDark ? '400' : '25'}%)`;
      c.drawImage(image, 0, 0);
      c.globalCompositeOperation = "destination-in";

      let stamp = (await import('../../src/NonmeronStamp')).default;
      c.translate(top, left);
      c.scale(scaling, scaling);
      c.fill(stamp);
      c.restore();

      c.globalCompositeOperation = "destination-over";
      c.drawImage(image, 0, 0);

      setIsProcessing(false);
      setResultImage(canv.toDataURL('image/jpeg', 0.95));
    };
    image.onerror = onError;
    if (savedImage === null) {
      onError();
      return;
    }
    image.src = savedImage.src;
  }

  function handleFileOpen(e: React.ChangeEvent<HTMLInputElement>) {
    setResultImage(null);
    setIsErrored(false);
    if (e.target.files!.length === 0) {
      console.log('No file was supplied.');
      return;
    }
    const file = e.target.files![0];
    const isFileTypeOK = file.type.match(/image\/.+/);
    if (!isFileTypeOK) {
      console.log('The file type is wrong! Aborting...');
      return;
    }
    let fr = new FileReader();
    fr.onload = () => {
      setSavedImage({
        name: file.name,
        src: fr.result as string
      });
      setCanProcess(true);
    };
    fr.readAsDataURL(file);
  }

  function downloadResult() {
    let link = document.createElement('a');
    link.href = resultImage!;
    link.download = 'Stamped-' + savedImage!.name;
    link.click();
  }

  return (
    <>
      <Head>
        <title>Stamper</title>
      </Head>
      <CenterBox>
        <TitleContainer titleComponent={<Typography variant="h4" align="center" p={1} pb={0}>Stamper</Typography>}>
          <Paper sx={{p: 1}}>
            <Stack spacing={1}>
              <Button variant="outlined" component="label" startIcon={<Photo />}>
                Open Image
                <input type="file" hidden accept="image/*" onChange={handleFileOpen} />
              </Button>
              <LoadingButton variant="contained" disabled={!canProcess} loading={isProcessing} onClick={handleClick} startIcon={<Approval />}>Stamp!</LoadingButton>
            </Stack>
            <Collapse in={isErrored}>
              <Alert severity="error" sx={{ mt: 1 }}>An error occured while trying to stamp! Please, try again.</Alert>
            </Collapse>
            <Collapse in={resultImage !== null} unmountOnExit>
              <Button disabled={resultImage === null} onClick={downloadResult} sx={{ mt: 1 }} fullWidth>Download Result</Button>
            </Collapse>
          </Paper>
        </TitleContainer>
      </CenterBox>
    </>
  )
}