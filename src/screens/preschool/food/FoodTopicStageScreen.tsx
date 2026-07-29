import { preschoolFoodTown } from "@/src/data/preschoolFoodTown";
import { PreschoolTopicStageScreen } from "@/src/screens/preschool/shared/PreschoolTopicStageScreen";

export function FoodTopicStageScreen() {
  return <PreschoolTopicStageScreen config={preschoolFoodTown} />;
}
