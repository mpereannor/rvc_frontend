import React, { useState, useEffect } from "react";
import RecipeFormOne from "./RecipeFormOne";
import RecipeFormTwo from "./RecipeFormTwo";
import RecipeFormThree from "./RecipeFormTwo";
import Ready from "./Ready";
import Footer from "./Footer";
import { addToNewRecipe } from "../actions";
import * as actionCreators from "../actions";
import { connect } from "react-redux";
import axios from "axios";
import { withFormik } from "formik";

function CreateRecipe(props) {
  const [recipeImage, setRecipeImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const nextPage = () => {
    setStep(step + 1);
  };
  const prevPage = () => {
    setStep(step - 1);
  };

  //form1
  const { addToNewReicpe } = props;
  const [formState, setFormState] = useState({
    title: '',
    recipe_category: '',
    tags: [],
    recipe_file: '',
    ingredients: [],
    instructions: []
  });

  const onHandleChange = e => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
    console.log("DDDDD", formState);
  };

  const onHandleSubmit = (e) => {
    e.preventDefault()
    console.log('ccc', e)
    // addToNewRecipe(formState);
    props.addToNewRecipe({ ...formState })
    nextPage()
  };



  //form2
  let UPLOAD_PRESET = "recipe_image";
  let CLOUDINARY_API = "https://api.cloudinary.com/v1_1/dr34bum3p/image/upload";

  const uploadImage = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", UPLOAD_PRESET);
    setLoading(true);
    axios
      .post(CLOUDINARY_API, data)
      .then(res => {
        setRecipeImage(res.data.secure_url);
        setFormState({
          ...formState,
          recipe_file: "something"
        });
        setLoading(false);
      })
      .catch(err => {
        console.log(
          "An error was encounterd while trying to upload this image",
          err
        );
      });
  };


 
  switch (step) {
    case 1:
      return (
        <div className="App">
          <div>
            <RecipeFormOne
              step={step}
              nextPage={nextPage}
              onHandleChange={onHandleChange}
              onHandleSubmit={onHandleSubmit}
              addToNewReicpe={addToNewReicpe}
            />
          </div>
          <Footer />
        </div>
      );
    case 2:
      return (
        <div className="App">
          <div>
            <p>Hello from CreateRecipe 2</p>
            <RecipeFormTwo
              step={step}
              prevPage={prevPage}
              nextPage={nextPage}
              uploadImage={uploadImage}
              recipeImage={recipeImage}
              loading={loading}
              onHandleChange={onHandleChange}
            />
          </div>
          <Footer />
        </div>
      );

    // case 3:
    //   return (
    //     <div className="App">
    //       <div>
    //         <p>This is step three page</p>
    //         <FormikIngredientForm />
    //       </div>
    //       <Footer />
    //     </div>
    //   );
    
    case 3:
      return (
        <div className="App">
          <div>
            <p>This is step three page</p>
            <RecipeFormThree
                step={step}
                prevPage={prevPage}
                nextPage={nextPage}
                loading={loading}
                onHandleChange={onHandleChange}
            />
          </div>
          <Footer />
        </div>
      );

    // case 4:
    //   return (
    //     <div className="App">
    //       <div>
    //         <p>This is step 4 page</p>
    //         <FormikInstructionForm />
    //       </div>
    //       <Footer />
    //     </div>
    //   );

    case 5:
      return (
        <div className="App">
          <div>
            <p>This is step three page</p>
            <Ready />
          </div>
          <Footer />
        </div>
      );

    default:
      return <p>Hello there</p>;
  }
}
export default connect(state => state.newRecipe, {addToNewRecipe} )(CreateRecipe);
