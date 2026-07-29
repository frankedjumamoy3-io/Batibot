import { preschoolFruitGarden } from "@/src/data/preschoolFruitGarden";
import { PreschoolTopicStageScreen } from "@/src/screens/preschool/shared/PreschoolTopicStageScreen";

export function FruitTopicStageScreen() {
  return <PreschoolTopicStageScreen config={preschoolFruitGarden} />;
}
