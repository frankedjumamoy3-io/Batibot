import { preschoolFoodTown } from "@/src/data/preschoolFoodTown";
import { PreschoolWorldScreen } from "@/src/screens/preschool/shared/PreschoolWorldScreen";

export function FoodTownScreen() {
  return <PreschoolWorldScreen config={preschoolFoodTown} />;
}
