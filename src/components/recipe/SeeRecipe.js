import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actionCreators from "../../actions/actionCreators";
import Popup from "reactjs-popup";

import IngredientList from "../ingredients/ingredientList/IngredientList";
import InstructionList from "../instructions/instructionList/InstructionList";
import Footer from "../navigation/footerNav/FooterNav";
import Loader from "../loader/Loader";

import arrow from "../../images/left-arrow.png";
import defaultRecipeImg from "../../images/foodplaceholder.png";

import { CardDiv } from "../../globals/card-styles";
import "../../App.css";
import {
  RecipeTopDiv,
  TopButtonDiv,
  ForkButton,
  ShareButton,
  ImgRecipe,
  DescriptionDiv,
  DetailsRecipe,
  ProfilePicture,
  BottomButtonDiv,
  LgButton
} from "./Recipe.styles";

function SeeRecipe({
  match,
  recipe,
  isFetching,
  getRecipesById, 
  userLikes,
  getUserLikes,
  likeRecipe,
  unlikeRecipe,
  displayLikeModal,
  user_id
}) {
  
  const shortDescription = (recipe.description + "").substr(0, 20);

  const recipeID = match.params.id.trim();

  const [localLikeState, setLocalLikeState] = useState(userLikes.includes(parseInt(recipeID)));

  useEffect(() => {
    getRecipesById(recipeID);
    getUserLikes(user_id);
  }, [getRecipesById, getUserLikes, recipeID, user_id]);

  const toggleLike = () => {
    if (localLikeState) { // If the recipe is already liked:
      unlikeRecipe(user_id, parseInt(recipeID));
      setLocalLikeState(false);
      displayLikeModal("Recipe removed from cookbook.", "/profile");
    } else { // Otherwise:
      likeRecipe(user_id, parseInt(recipeID));
      setLocalLikeState(true);
      displayLikeModal("Recipe added to cookbook!", "/profile");
    }
  }

  return (
    <div>
      <RecipeTopDiv>
        <div>
          <Link to="/">
            <img src={arrow} alt="arrow" />
          </Link>
        </div>

        <TopButtonDiv>
          <ShareButton>
            <h1>Share</h1>
          </ShareButton>

          <ForkButton
            onClick={toggleLike}
            className={localLikeState ? "liked" : null}
          >
            <h1>{localLikeState ? "Forked" : "Fork"}</h1>
          </ForkButton>
        </TopButtonDiv>
      </RecipeTopDiv>

      <CardDiv>
        {isFetching ? <Loader /> : null}

        <ImgRecipe>
          <img
            src={recipe.images ? recipe.images[0] : null || defaultRecipeImg}
            alt={recipe.recipe_title}
          />
        </ImgRecipe>

        <DescriptionDiv>
          <ProfilePicture>
            <h1>
              {" "}
              {recipe.author
                ? recipe.author[0].toUpperCase()
                : null || `C`}{" "}
            </h1>
          </ProfilePicture>

          <DetailsRecipe>
            <p className="recipe-title">{recipe.recipe_title || ""}</p>
            <Popup modal trigger={<p className="recipe-description">{`${shortDescription}...`}</p>}>
              {close => <p close={close}>{recipe.description}</p>}
            </Popup>
          </DetailsRecipe>
        </DescriptionDiv>

        <BottomButtonDiv>
          <Popup modal trigger={<LgButton>Ingredients</LgButton>}>
            {close => (
              <IngredientList ingredients={recipe.ingredients} close={close} />
            )}
          </Popup>

          <Popup modal trigger={<LgButton>Instructions</LgButton>}>
            {close => (
              <InstructionList
                instructions={recipe.instructions}
                close={close}
              />
            )}
          </Popup>
        </BottomButtonDiv>
      </CardDiv>

      <Footer />
    </div>
  );
}

export default connect(state => ({
  ...state.singleRecipe,
  // Likes:
  userLikes: state.userLikes.likes,
  user_id: state.onboard.user_id
}),
actionCreators)(SeeRecipe);
