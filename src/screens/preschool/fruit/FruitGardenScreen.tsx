import { preschoolFruitGarden } from "@/src/data/preschoolFruitGarden";
import { PreschoolWorldScreen } from "@/src/screens/preschool/shared/PreschoolWorldScreen";

export function FruitGardenScreen() {
  return <PreschoolWorldScreen config={preschoolFruitGarden} />;
}
