export enum TimeUnit {
  Second = "sec",
  Minute = "min",
  Hour = "hr",
}

export interface UserData {
  userId: string;
  photoUrl?: string;
  firstName?: string;
  lastName?: string;
}

export enum RecipeCategory {
  Bread = "Bread",
  Cake = "Cake",
  // Breakfast = 'breakfast',
  // Lunch = 'lunch',
  // Dinner = 'dinner',
  // Snacks = 'snacks',
  Sourdough = "Sourdough",
  Foccaccia = "Foccaccia",
  // Celebration = 'celebration',
  // Ciabatta = 'ciabatta',
  // Brioche = 'brioche',
  // Flatbread = 'flatbread',
  // Bagel = 'bagel',
  // Cornbread = 'cornbread',
  // Sodabread = 'sodabread',
  White = "White",
  Wholemeal = "Wholemeal",
  // Rye = 'rye',
  // Multigrain = 'multigrain',
  // Baguette = 'baguette',
  // Pumpernickel = 'pumpernickel',
  // Challah = 'challah',
}

export const recipeCategories = Object.values(RecipeCategory);

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  creatorDetails: UserData;
  // TODO Remove communityRating - Removed from FE code as of v1.3.0
  communityRating: number | null;
  rating?: {
    value: number | null;
    totalRatings: number;
  };
  totalSaves: number;
  difficulty: RecipeDifficulty;
  images: RecipeImage[];
  categories: RecipeCategory[];
  ingredients: RecipeIngredient[];
  ingredientGroups?: RecipeIngredientGroup[];
  steps: RecipeStep[];
}

export interface Time {
  unit: TimeUnit;
  value: number;
}

export interface ExternalRecipe
  extends Omit<Recipe, "ingredients" | "creatorDetails" | "steps" | "images"> {
  duration: Time;
  ingredients: ExternalRecipeIngredient[];
  ingredientGroups?: RecipeIngredientGroup[];
  sourceUrl: string;
  steps: ExternalRecipeStep[];
  stepGroups: RecipeStepGroup[];
  images: ExternalRecipeImage[];
}

export interface ExternalRecipeImage {
  srcSet: { uri: string; width: number; height: number }[];
  blurhash: string;
}

export interface RecipeImage {
  downloadUrl: string;
  storageReferencePath: string;
  blurhash?: string;
}

export interface LocalRecipeImage {
  localPath: string;
  storageReferencePath?: string;
}

export interface ExternalRecipeIngredient {
  id: string;
  title: string;
  groupId?: string;
}

export interface RecipeIngredient {
  id: string;
  title: string;
  // amount: Misc | Weight | Volume;
  // recommendedTemperature?: Temperature;
  isOptional: boolean;
  groupId?: string;
}

export interface RecipeIngredientGroup {
  id: string;
  title: string;
}

export interface RecipeStepGroup {
  id: string;
  title: string;
}

export interface ExternalRecipeStep {
  id: string;
  title?: string;
  description: string;
  groupId?: string;
}

export interface RecipeStep {
  id: string;
  title: string;
  description: string;
  // inactiveDuration?: Time;
  repititions?: RecipeStepRepitition;
  tips?: string[];
}

export interface RecipeStepRepitition {
  min: number;
  max: number;
  // timeBetween: Time;
  addTimeAfter: boolean;
}

export enum RecipeDifficulty {
  Easy = "Easy",
  Intermediate = "Intermediate",
  Expert = "Expert",
}

export const recipeDifficulties = Object.values(RecipeDifficulty);

// Recipe object with optional local images before submission
export interface RecipeFormPreSubmission
  extends Omit<RecipeFormSubmission, "images"> {
  images: (RecipeImage | LocalRecipeImage)[];
}

// Recipe object after converting local images to remote stored
export interface RecipeFormSubmission
  extends Omit<
    Recipe,
    "_id" | "creatorDetails" | "communityRating" | "totalSaves"
  > {
  // Set _id to optional to allow existing recipes to be submitted
  _id?: string;
}

export interface SavedRecipe {
  recipeId: string;
}

export interface CompletedRecipe {
  recipeId: string;
  count: number;
}

export interface RatedRecipe {
  recipeId: string;
  rating: number;
}

export interface PersonalisedRecipes {
  recipeOfTheWeek?: Recipe;
  popularRecipes: Recipe[];
  createdRecipes: Recipe[];
  savedRecipes: SavedRecipe[];
  ratedRecipes: RatedRecipe[];
  completedRecipes: CompletedRecipe[];
}
