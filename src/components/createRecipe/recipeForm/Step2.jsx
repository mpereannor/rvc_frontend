import React, { useState } from "react";
import { connect } from "react-redux";
import * as dispatchers from "../../../actions/actionCreators";
import CheckIcon from "@material-ui/icons/Check";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Fab from '@material-ui/core/Fab';
import {
  NavigationSection1,
  Addtitle,
  Section3,
  ExportImg
} from "./FormStyled.styles";

import foodplaceholder from "../../../images/foodplaceholder.png";
import axios from "axios";

function Step2(props) {
  const [imgUrl, setImgUrl] = useState(false);
  const { goForward, goBackward, addImagesToBody } = props;

  const onSubmit = e => {
    e.preventDefault();
    addImagesToBody(imgUrl);
    goForward(e);
  };

  const goBack = e => {
    goBackward();
  };

  const uploadImage = async e => {
    e.preventDefault();
    try {
      const files = e.target.files;
      const data = new FormData();
      data.append("file", files[0]);
      data.append("upload_preset", "recipe_image");
      const imageUrl = await axios.post(
        "https://api.cloudinary.com/v1_1/dr34bum3p/image/upload",
        data
      );
      // Then
      setImgUrl([imageUrl.data.secure_url]);
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <form onSubmit={onSubmit}>
      <Section3>
        <NavigationSection1>
          <Fab 
          style={{background: "none", "box-shadow": "none", "outline": 'none'}}
          >
            <ArrowBackIcon className="back-arrow" onClick={goBack} cgit />
          </Fab>
          <Fab 
          style={{background: "none", "box-shadow": "none", "outline": 'none'}}
          >
            <CheckIcon className="check-icon" onClick={goForward} cgit />
          </Fab>
        </NavigationSection1>
        <Addtitle>
          <h1>Upload Image</h1>
        </Addtitle>
      </Section3>
      <ExportImg>
        <div>
          {imgUrl ? (
            <img alt="Img file to be uploaded" src={imgUrl} />
          ) : (
            <img
              src={foodplaceholder}
              alt="A display of the already finished recipe"
            />
          )}
        </div>
        <div>
          <input
            type="file"
            onChange={uploadImage}
            name="imageUrl"
          />
        </div>
      </ExportImg>
    </form>
  );
}

export default connect(state => state, dispatchers)(Step2);
